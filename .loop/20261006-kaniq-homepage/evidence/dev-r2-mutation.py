from pathlib import Path
import subprocess,os
p=Path('src/components/layout/SiteFooter.tsx');original=p.read_text();out=[]
env={**os.environ,'NODE_OPTIONS':'--max-old-space-size=3072'}
try:
 for literal in ['{"cta"}', "{'cta cta--rogue'}"]:
  changed=original.replace('className="site-foot"','className='+literal,1)
  assert changed!=original
  p.write_text(changed)
  r=subprocess.run(['npx','vitest','run','tests/guards.test.ts'],text=True,capture_output=True,env=env)
  out.append('Mutation className='+literal+'\nexit: '+str(r.returncode)+'\n'+r.stdout+r.stderr)
  assert r.returncode==1
finally:
 p.write_text(original)
 r=subprocess.run(['npx','vitest','run','tests/guards.test.ts'],text=True,capture_output=True,env=env)
 out.append('Restored SiteFooter (byte-for-byte)\nexit: '+str(r.returncode)+'\n'+r.stdout+r.stderr)
 Path('.loop/20261006-kaniq-homepage/evidence/dev-r2-guards-mutation.log').write_text('\n'.join(out))
 assert r.returncode==0
print('Both literal-expression mutations FAIL; original restored, guard PASS')
