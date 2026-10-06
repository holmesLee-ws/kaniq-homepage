import subprocess,json,re
from pathlib import Path
out=[]
def curl(path,args=[]):
 return subprocess.check_output(['curl','-s',*args,'http://localhost:3000'+path]).decode()
for header in ['en','ja','id','mn','ko','ko-KR','ko;q=0.1, en;q=0.9','fr',None]:
 x=curl('/',['-I']+(['-H','Accept-Language: '+header] if header else []));out.append(str(header)+' '+x);expected='en' if header in [None,'fr','ko;q=0.1, en;q=0.9'] else header.split('-')[0];assert '/'+expected in x and '307' in x
for lang in ['en','ja','id','mn','ko']:
 for suffix in ['','/quote']:
  x=curl('/'+lang+suffix);status=curl('/'+lang+suffix,['-o','/dev/null','-w','%{http_code}']);assert status=='200';assert '<html lang="'+lang+'"' in x
  tags=re.findall(r'<title>.*?</title>|<meta name="description"[^>]+>|<link rel="alternate"[^>]+>|<meta property="og:image"[^>]+>',x);out.append(lang+suffix+' 200 '+json.dumps(tags,ensure_ascii=False));assert len([t for t in tags if 'rel="alternate"' in t])==6;assert 'hrefLang="x-default" href="https://kaniq-homepage.vercel.app/en'+suffix+'"' in x
  if not suffix:
   og=re.search(r'<meta property="og:image" content="([^"]+)"',x)[1];local=og.replace('https://kaniq-homepage.vercel.app','');assert curl(local,['-o','/dev/null','-w','%{http_code}'])=='200';out.append('OG '+local+' 200')
for lang in ['hi','ru','vi','zh','es','th']:
 status=curl('/'+lang,['-o','/dev/null','-w','%{http_code}']);out.append('/'+lang+' '+status);assert status=='404'
sitemap=curl('/sitemap.xml');assert sitemap.count('<loc>')==10;out.append(sitemap);out.append(curl('/robots.txt'))
for body,code in [({'lang':'ja','interest':'dental','timing':'not-sure','name':'Test','contactMethod':'email','contact':'t@example.com','consent':True},'200'),({'lang':'ja'},'422')]:
 x=curl('/api/quote',['-w',' %{http_code}','-H','content-type: application/json','-d',json.dumps(body)]);out.append(x);assert x.endswith(code)
Path('.loop/20261006-kaniq-homepage/evidence/dev-http.log').write_text('\n'.join(out))
print('A1/A6/A8 HTTP assertions passed; homes/quote 10 × 200, six phase-two 404, sitemap 10, OG 200')
