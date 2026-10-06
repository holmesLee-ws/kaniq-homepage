import subprocess
from pathlib import Path
commands=["rg -n -w -e '[내부수치]' -e '[내부수치]' -e '[내부수치]' -e '[내부수치]' -e '[내부수치]' -e '수수료율' -e 'commission rate' -e 'referral rate' src/content", "rg -n -i -w -e best -e guarantee -e guaranteed -e 'No\\.1' -e 'half the cost' -e 'before and after' -e cheapest src", "rg -n -e 최고 -e 보장 -e 줄기세포 -e 전후 -e 保証 -e 最高 -e 'stem cell' src", "rg -n -e '[내부수치]' -e '[내부수치]' -e '[내부수치]' -e '[내부수치]' -e 'CPL' -e '[내부수치]' src README.md", "git diff origin/main -- design/drafts"]
out=[]
for cmd in commands:
 r=subprocess.run(cmd,shell=True,capture_output=True,text=True);out.append(f'$ {cmd}\nexit: {r.returncode}\nstdout: {r.stdout or "(empty)"}\nstderr: {r.stderr or "(empty)"}\n');assert r.returncode==(0 if cmd.startswith('git') else 1);assert not r.stdout
Path('.loop/20261006-kaniq-homepage/evidence/dev-guards.log').write_text('\n'.join(out));print('A4/A9 exact commands: 0 matches, protected draft diff empty')
