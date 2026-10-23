#!/usr/bin/env python3
"""Install, validate, and remove this repository as a DSH filesystem skill."""

from __future__ import annotations

import argparse
import importlib.util
import json
import os
import re
import shutil
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parent.parent
MARKER = ".dsh-package.json"
NAME_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
IGNORED = {
    ".git",
    ".venv",
    "venv",
    "node_modules",
    "__pycache__",
    ".pytest_cache",
    "dist",
    "build",
}


class PackageError(RuntimeError):
    """A user-actionable package-management failure."""


def load_manifest(root: Path = ROOT) -> dict[str, Any]:
    path = root / "dsh" / "manifest.json"
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise PackageError(f"无法读取 DSH manifest：{path}: {exc}") from exc
    name = data.get("name")
    if data.get("schema") != "dsh-skill-package/v1" or not isinstance(name, str):
        raise PackageError(f"无效的 DSH manifest：{path}")
    if not NAME_RE.fullmatch(name):
        raise PackageError(f"Skill 名称必须是 kebab-case：{name!r}")
    return data


def dsh_home(value: str | None) -> Path:
    raw = value or os.environ.get("DSH_HOME")
    return Path(raw).expanduser() if raw else Path.home() / ".dsh"


def _frontmatter(skill_file: Path) -> dict[str, str]:
    text = skill_file.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return {}
    end = text.find("\n---\n", 4)
    if end < 0:
        return {}
    block = text[4:end]
    values: dict[str, str] = {}
    for key in ("name", "description", "user-invocable"):
        match = re.search(rf"(?m)^{re.escape(key)}:\s*([^\n]*)$", block)
        if match:
            values[key] = match.group(1).strip().strip('"\'')
    return values


def validate_source(root: Path, manifest: dict[str, Any]) -> list[str]:
    issues: list[str] = []
    skill = root / "SKILL.md"
    if not skill.is_file():
        return [f"缺少 {skill}"]
    fields = _frontmatter(skill)
    if fields.get("name") != manifest["name"]:
        issues.append(f"SKILL.md name 应为 {manifest['name']!r}")
    if not fields.get("description"):
        issues.append("SKILL.md 缺少 description")
    if fields.get("user-invocable") != "true":
        issues.append("SKILL.md 缺少 user-invocable: true")
    return issues


def _ignore(_directory: str, names: list[str]) -> list[str]:
    ignored = []
    for name in names:
        if name in IGNORED or name.endswith((".pyc", ".pyo", ".egg-info")):
            ignored.append(name)
    return ignored


def _marker(target: Path) -> dict[str, Any] | None:
    try:
        data = json.loads((target / MARKER).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    return data if data.get("schema") == "dsh-skill-install/v1" else None


def _managed(target: Path, name: str) -> bool:
    data = _marker(target)
    return bool(data and data.get("name") == name)


def _direct_child(target: Path, skills_root: Path) -> None:
    if target.parent.resolve() != skills_root.resolve():
        raise PackageError(f"拒绝操作 skills 根目录以外的路径：{target}")


def _backup_path(target: Path) -> Path:
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    candidate = target.with_name(f"{target.name}.backup-{stamp}")
    counter = 1
    while candidate.exists():
        candidate = target.with_name(f"{target.name}.backup-{stamp}-{counter}")
        counter += 1
    return candidate


def install(root: Path, home: Path, force: bool = False) -> dict[str, str]:
    manifest = load_manifest(root)
    issues = validate_source(root, manifest)
    if issues:
        raise PackageError("源包校验失败：\n- " + "\n- ".join(issues))
    skills_root = home / "skills"
    skills_root.mkdir(parents=True, exist_ok=True)
    name = manifest["name"]
    target = skills_root / name
    _direct_child(target, skills_root)
    exists = target.exists() or target.is_symlink()
    if exists and not _managed(target, name) and not force:
        raise PackageError(f"发现非本工具管理的同名目录：{target}。使用 --force 时会先备份。")

    temp_parent = Path(tempfile.mkdtemp(prefix=f".{name}.install-", dir=skills_root))
    staged = temp_parent / name
    backup: Path | None = None
    previous: Path | None = None
    try:
        shutil.copytree(root, staged, ignore=_ignore)
        marker = {
            "schema": "dsh-skill-install/v1",
            "name": name,
            "version": manifest["version"],
            "source": str(root.resolve()),
            "installed_at": datetime.now(timezone.utc).isoformat(),
        }
        (staged / MARKER).write_text(
            json.dumps(marker, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        action = "installed"
        if exists:
            if _managed(target, name):
                previous = target.with_name(f".{name}.previous")
                suffix = 1
                while previous.exists():
                    previous = target.with_name(f".{name}.previous-{suffix}")
                    suffix += 1
                target.rename(previous)
                action = "updated"
            else:
                backup = _backup_path(target)
                target.rename(backup)
                action = "backed-up-and-installed"
        try:
            staged.rename(target)
        except Exception:
            restore = previous or backup
            if restore and restore.exists() and not target.exists():
                restore.rename(target)
            raise
        if previous and previous.exists():
            shutil.rmtree(previous)
    finally:
        if temp_parent.exists():
            shutil.rmtree(temp_parent)
    result = {"name": name, "action": action, "target": str(target)}
    if backup:
        result["backup"] = str(backup)
    return result


def _runtime_report(manifest: dict[str, Any]) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    runtime = manifest.get("runtime", {})
    minimum = str(runtime.get("python", "")).split(".")
    if len(minimum) == 2 and all(part.isdigit() for part in minimum):
        wanted = (int(minimum[0]), int(minimum[1]))
        if sys.version_info[:2] < wanted:
            errors.append(f"需要 Python {wanted[0]}.{wanted[1]}+")
    for module in runtime.get("python_modules", []):
        if importlib.util.find_spec(module) is None:
            errors.append(f"缺少 Python 模块：{module}")
    commands = runtime.get("commands", [])
    for command in commands:
        if shutil.which(command) is None:
            errors.append(f"PATH 中未找到命令：{command}")
    optional = runtime.get("optional_commands", [])
    if optional and not any(shutil.which(command) for command in optional):
        warnings.append("未在 PATH 找到本地浏览器命令；使用远程 CDP 时可以忽略")
    return errors, warnings


def doctor(root: Path, home: Path, source_only: bool = False) -> dict[str, Any]:
    manifest = load_manifest(root)
    errors = validate_source(root, manifest)
    warnings: list[str] = []
    installed = False
    target = home / "skills" / manifest["name"]
    if not source_only:
        installed = (target / "SKILL.md").is_file()
        if not installed:
            errors.append(f"尚未安装：{target}")
        elif not _managed(target, manifest["name"]):
            errors.append(f"安装目录缺少有效所有权标记：{target}")
    runtime_errors, runtime_warnings = _runtime_report(manifest)
    errors.extend(runtime_errors)
    warnings.extend(runtime_warnings)
    return {
        "ok": not errors,
        "name": manifest["name"],
        "version": manifest["version"],
        "target": str(target),
        "installed": installed,
        "errors": errors,
        "warnings": warnings,
    }


def uninstall(root: Path, home: Path) -> dict[str, str]:
    manifest = load_manifest(root)
    skills_root = home / "skills"
    target = skills_root / manifest["name"]
    _direct_child(target, skills_root)
    if not target.exists() and not target.is_symlink():
        action = "absent"
    elif _managed(target, manifest["name"]):
        shutil.rmtree(target)
        action = "removed"
    else:
        action = "skipped-unmanaged"
    return {"name": manifest["name"], "action": action, "target": str(target)}


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser(description="DeepSeek Harness skill package manager")
    result.add_argument("--repo-root", type=Path, default=ROOT, help=argparse.SUPPRESS)
    result.add_argument("--dsh-home", help="DSH_HOME；默认读取环境变量或 ~/.dsh")
    result.add_argument("--json", action="store_true", help="输出 JSON")
    commands = result.add_subparsers(dest="command", required=True)
    install_command = commands.add_parser("install", help="安装或更新 skill")
    install_command.add_argument("--force", action="store_true", help="备份并替换非本工具管理的同名目录")
    doctor_command = commands.add_parser("doctor", help="检查源包、安装和运行环境")
    doctor_command.add_argument("--source-only", action="store_true", help="不检查安装副本")
    commands.add_parser("uninstall", help="仅删除由本工具管理的安装副本")
    return result


def main(argv: list[str] | None = None) -> int:
    args = parser().parse_args(argv)
    root = args.repo_root.resolve()
    home = dsh_home(args.dsh_home)
    try:
        if args.command == "install":
            result = install(root, home, force=args.force)
            code = 0
        elif args.command == "doctor":
            result = doctor(root, home, source_only=args.source_only)
            code = 0 if result["ok"] else 1
        else:
            result = uninstall(root, home)
            code = 0
    except PackageError as exc:
        result = {"ok": False, "error": str(exc)}
        code = 2
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    elif "error" in result:
        print(f"错误：{result['error']}", file=sys.stderr)
    elif args.command == "doctor":
        print("[OK] DSH 检查通过" if result["ok"] else "[FAIL] DSH 检查失败")
        print(f"  target: {result['target']}")
        for message in result["errors"]:
            print(f"  ERROR: {message}")
        for message in result["warnings"]:
            print(f"  WARN: {message}")
    else:
        print(f"{result['action']}: {result['target']}")
        if result.get("backup"):
            print(f"backup: {result['backup']}")
    return code


if __name__ == "__main__":
    raise SystemExit(main())
