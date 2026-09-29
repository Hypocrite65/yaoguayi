#!/usr/bin/env python3
"""从 GitHub API 拉取 claude 分支提交历史，生成 site/data/versions.json。

每条 git 记录 = 一个版本：按时间先后编号 v1, v2, ...，最新最高。
名为"更新版本记录"的例行提交会被过滤，不占用版本号。

用法：
    scripts/gen-versions.py
"""
import json
import os
import sys
from datetime import datetime, timezone

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)),
                               "..", "..", "skills", "github", "bin"))
from ghapi import api  # noqa: E402

OWNER, REPO, BRANCH = "Hypocrite65", "yaoguayi", "main"
SKIP_PREFIX = "更新版本记录"

def main():
    commits = []
    page = 1
    while True:
        _, data = api("GET",
                      f"/repos/{OWNER}/{REPO}/commits?sha={BRANCH}&per_page=100&page={page}")
        if not data:
            break
        commits.extend(data)
        if len(data) < 100:
            break
        page += 1

    # 过滤例行版本记录提交，按时间正序编号
    items = [c for c in commits
             if not c["commit"]["message"].split("\n")[0].startswith(SKIP_PREFIX)]
    items.sort(key=lambda c: c["commit"]["author"]["date"])

    versions = [{
        "v": i + 1,
        "sha": c["sha"][:8],
        "date": c["commit"]["author"]["date"][:10],
        "subject": c["commit"]["message"].split("\n")[0][:60],
    } for i, c in enumerate(items)]
    versions.reverse()  # 新的在前

    out = {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "branch": BRANCH,
        "versions": versions,
    }
    repo_root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
    dest = os.path.join(repo_root, "site", "data", "versions.json")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"wrote {dest}: {len(versions)} versions, latest v{versions[0]['v']} ({versions[0]['sha']})")

if __name__ == "__main__":
    main()
