$b='http://localhost:4173'
function post($body,$origin){ $o=@(); if($origin){$o=@('-H',"Origin: $origin")}; $f=[IO.Path]::GetTempFileName(); [IO.File]::WriteAllText($f,$body); curl.exe -s -o - -w " [%{http_code}]" -X POST "$b/api/marina-trial" -H 'Content-Type: application/json' @o --data-binary "@$f"; Remove-Item $f }
"--- headers /marina-sdr"; curl.exe -sI "$b/marina-sdr" | Select-String -Pattern 'HTTP|content-security|x-content|referrer|permissions|x-frame|strict|cache|content-type'
"--- 301"; curl.exe -sI "$b/marina-teste" | Select-String 'HTTP|Location'
"--- assets"; foreach($p in '/marina-sdr/app.js','/marina-sdr/styles.css','/marina-sdr/img/og-marina-sdr.png','/robots.txt','/sitemap.xml','/llms.txt','/marina-sdr/marina-demo.mp4'){ "$p " + (curl.exe -s -o NUL -w '%{http_code} %{content_type}' "$b$p") }
"--- SPA home"; curl.exe -s -o NUL -w '%{http_code}' "$b/"; ""
"--- evil origin"; post '{"name":"Teste","whatsapp":"47999999999","email":"a@b.com","consent":true}' 'https://evil.example'
"--- no origin"; post '{}' $null
"--- bad input"; post '{"name":"","whatsapp":"123","email":"x","consent":false}' 'http://localhost:4173'
"--- honeypot"; post '{"name":"Teste Bot","whatsapp":"47999999999","email":"a@b.com","consent":true,"website":"http://spam"}' 'http://localhost:4173'
"--- big payload"; $big='{"name":"'+('A'*30000)+'"}'; post $big 'http://localhost:4173'
