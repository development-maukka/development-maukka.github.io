const translations={en:{apps:'Apps',about:'About',intro:'Small, useful Android apps built with curiosity.',soon:'Download published apps below. More releases are coming soon.',download:'Download APK',history:'All versions',version:'Version',description:'Independent Android projects. Each release is published separately and downloads require user action. Older versions remain available in GitHub Releases.',pending:'Release coming soon',items:[['Sports Radar 13','Sports highlights from multiple leagues.'],['CashMoney','Market and portfolio tracking in a teletext-inspired interface.'],['It’sShowTime!','A transparent clock widget with date, alarm, weather and automatic update checks.'],['GotJuice?','Wi-Fi and mobile signal information.'],['StartMeUp','Charging and battery monitoring.'],['Subs','Download YouTube subtitles and transcribe local audio and video files with Groq. Share the text with AI for summaries.'],['EADG','Explore music through album artwork, tracks, lyrics and artist stories.']]},fi:{apps:'Sovellukset',about:'Tietoa',intro:'Pieniä, hyödyllisiä Android-sovelluksia uteliaisuudesta.',soon:'Lataa julkaistut sovellukset alta. Lisää julkaisuja on tulossa.',download:'Lataa APK',history:'Kaikki versiot',version:'Versio',description:'Itsenäisiä Android-projekteja. Jokainen versio julkaistaan erikseen, ja lataaminen tapahtuu käyttäjän valinnasta. Vanhat versiot säilyvät GitHub Releases -julkaisuissa.',pending:'Julkaisu tulossa',items:[['Sports Radar 13','Urheilukoosteita useista sarjoista.'],['CashMoney','Markkina- ja salkkuseuranta teksti-TV-hengessä.'],['It’sShowTime!','Läpinäkyvä kellovidget: päivämäärä, herätys, sää ja automaattinen päivitystarkistus.'],['GotJuice?','Wi-Fi- ja mobiilisignaalin tiedot.'],['StartMeUp','Latauksen ja akun seuranta.'],['Subs','Lataa YouTube-tekstityksiä ja litteroi paikallisia ääni- ja videotiedostoja Groqilla. Jaa teksti AI:lle referointia varten.'],['EADG','Tutustu musiikkiin levynkansien, kappaleiden, sanoitusten ja artistitarinoiden kautta.']]},de:{apps:'Apps',about:'Über uns',intro:'Kleine, nützliche Android-Apps aus Neugier entwickelt.',soon:'Veröffentlichte Apps unten herunterladen. Weitere Versionen folgen.',download:'APK herunterladen',history:'Alle Versionen',version:'Version',description:'Unabhängige Android-Projekte. Jede Version wird separat veröffentlicht und Downloads werden vom Nutzer bestätigt. Ältere Versionen bleiben in GitHub Releases verfügbar.',pending:'Veröffentlichung folgt',items:[['Sports Radar 13','Sport-Highlights aus mehreren Ligen.'],['CashMoney','Markt- und Depotübersicht im Teletext-Stil.'],['It’sShowTime!','Transparentes Uhr-Widget mit Datum, Wecker, Wetter und automatischer Updateprüfung.'],['GotJuice?','WLAN- und Mobilfunksignale im Überblick.'],['StartMeUp','Lade- und Akkuüberwachung.'],['Subs','Lade YouTube-Untertitel herunter und transkribiere lokale Audio- und Videodateien mit Groq. Teile den Text mit einer KI für Zusammenfassungen.'],['EADG','Entdecke Musik mit Albumcovern, Titeln, Songtexten und Künstlergeschichten.']]}};const language=(navigator.language||'en').split('-')[0];const t=translations[language]||translations.en;document.documentElement.lang=translations[language]?language:'en';document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t[el.dataset.i18n]);document.getElementById('appgrid').replaceChildren(...t.items.map(([name,desc])=>{const el=document.createElement('article');el.className='app';const h=document.createElement('h3');h.textContent=name;const p=document.createElement('p');p.textContent=desc;const s=document.createElement('span');s.className='status';s.textContent=t.pending;const repo=({'GotJuice?':'GotJuice','Subs':'Subs','Sports Radar 13':'Sports-Radar-13','CashMoney':'CashMoney','It’sShowTime!':'ItsShowTime','StartMeUp':'StartMeUp','EADG':'EADG'})[name];if(repo){const v=document.createElement('span');v.className='release';v.textContent=t.version+' …';v.dataset.releaseVersion=repo;const a=document.createElement('a');a.className='download';a.href='https://github.com/development-maukka/'+repo+'/releases/latest';a.dataset.releaseDownload=repo;a.textContent=t.download;a.rel='noopener noreferrer';const history=document.createElement('a');history.className='history';history.href='https://github.com/development-maukka/'+repo+'/releases';history.rel='noopener noreferrer';history.textContent=t.history;el.append(h,p,v,a,history)}else{el.append(h,p,s)}return el}));document.getElementById('year').textContent=new Date().getFullYear();




// Resolve each published app independently from its latest stable GitHub release.
async function refreshRelease(versionEl){
  const repo=versionEl.dataset.releaseVersion;
  const downloadEl=versionEl.parentElement.querySelector('[data-release-download]');
  if(!downloadEl)return;
  const repoUrl='https://github.com/development-maukka/'+repo;
  const releasesUrl=repoUrl+'/releases/latest';
  downloadEl.href=releasesUrl;
  try{
    const response=await fetch('https://api.github.com/repos/development-maukka/'+repo+'/releases/latest',{
      headers:{Accept:'application/vnd.github+json'},cache:'no-store'
    });
    if(!response.ok)throw new Error('GitHub API '+response.status);
    const release=await response.json();
    if(!release||release.draft||release.prerelease||typeof release.tag_name!=='string')throw new Error('Invalid release');
    const version=release.tag_name.replace(/^v/i,'');
    if(!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(version))throw new Error('Invalid version');
    versionEl.textContent=t.version+' '+version;
    const asset=Array.isArray(release.assets)?release.assets.find(a=>typeof a.name==='string'&&/\.apk$/i.test(a.name)&&typeof a.browser_download_url==='string'&&a.browser_download_url.startsWith(repoUrl+'/releases/download/')):null;
    if(asset)downloadEl.href=asset.browser_download_url;
  }catch(error){
    // Keep the release page accessible if GitHub is unavailable or rate-limited.
    versionEl.textContent=t.version+' —';
    downloadEl.href=releasesUrl;
    console.warn(repo+' release metadata unavailable:',error.message);
  }
}
document.querySelectorAll('[data-release-version]').forEach(refreshRelease);






