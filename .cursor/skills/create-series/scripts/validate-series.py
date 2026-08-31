#!/usr/bin/env python3
"""Validate a series folder against the create-series schema."""

from __future__ import annotations

import json
import sys
from pathlib import Path


def fail(message: str) -> None:
    print(f"error: {message}", file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    if len(sys.argv) != 2:
        fail("usage: validate-series.py <series-dir>")

    series_dir = Path(sys.argv[1]).resolve()
    series_path = series_dir / "series.json"
    if not series_path.is_file():
        fail(f"missing {series_path}")

    data = json.loads(series_path.read_text())
    series_id = data.get("id")
    if series_id != series_dir.name:
        fail(f"id {series_id!r} does not match folder {series_dir.name!r}")

    if data.get("root") != "0":
        fail("root must be '0'")
    duration = data.get("durationSeconds")
    if not isinstance(duration, int) or isinstance(duration, bool) or duration < 5:
        fail("durationSeconds must be an integer >= 5")

    episodes = data.get("episodes")
    if not isinstance(episodes, dict) or "0" not in episodes:
        fail("episodes must be an object that includes '0'")

    errors: list[str] = []

    def check_episode(eid: str) -> None:
        ep = episodes.get(eid)
        if not isinstance(ep, dict):
            errors.append(f"{eid}: missing")
            return
        depth = len(eid) - 1
        if ep.get("id") != eid:
            errors.append(f"{eid}: id mismatch")
        if ep.get("depth") != depth:
            errors.append(f"{eid}: depth should be {depth}")
        if not ep.get("prompt"):
            errors.append(f"{eid}: empty prompt")

        video = ep.get("video") or ""
        last = ep.get("lastFrame") or ""
        if video and not (series_dir / video).is_file():
            errors.append(f"{eid}: missing file {video}")
        if last and not (series_dir / last).is_file():
            errors.append(f"{eid}: missing file {last}")

        if eid == "0":
            if ep.get("startFrame"):
                errors.append("0: root must not have startFrame")
        else:
            parent = eid[:-1]
            expected = f"media/{parent}.last.jpg"
            if ep.get("startFrame") != expected:
                errors.append(f"{eid}: startFrame should be {expected}")

        branches = ep.get("branches")
        if not isinstance(branches, list):
            errors.append(f"{eid}: branches must be a list")
            return

        is_leaf = depth >= 3
        if is_leaf:
            if branches:
                errors.append(f"{eid}: leaf must have empty branches")
            return
        if len(branches) != 2:
            errors.append(f"{eid}: expected 2 branches")
            return
        for letter, branch in zip("ab", branches, strict=True):
            child = eid + letter
            if branch.get("to") != child:
                errors.append(f"{eid}: branch {letter} should go to {child}")
            if not branch.get("label"):
                errors.append(f"{eid}: branch {letter} missing label")
            check_episode(child)

    check_episode("0")

    extra = set(episodes) - expected_ids()
    if extra:
        errors.append(f"unexpected episode ids: {sorted(extra)}")

    if errors:
        for item in errors:
            print(f"error: {item}", file=sys.stderr)
        raise SystemExit(1)

    print(f"ok: {series_id} ({len(episodes)} episodes)")


def expected_ids() -> set[str]:
    ids = {"0"}
    frontier = ["0"]
    for _ in range(3):
        nxt = []
        for eid in frontier:
            nxt.extend([eid + "a", eid + "b"])
        ids.update(nxt)
        frontier = nxt
    return ids


if __name__ == "__main__":
    main()
