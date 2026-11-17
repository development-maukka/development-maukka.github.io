const translations={en:{apps:'Apps',about:'About',intro:'Small, useful Android apps built with curiosity.',soon:'Download published apps below. More releases are coming soon.',download:'Download APK',history:'All versions',version:'Version',description:'Independent Android projects. Each release is published separately and downloads require user action. Older versions remain available in GitHub Releases.',pending:'Release coming soon',items:[['Sports Radar 13','Sports highlights from multiple leagues.'],['CashMoney','Market and portfolio tracking in a teletext-inspired interface.'],['It’sShowTime!','A customizable Android clock widget.'],['GotJuice?','Wi-Fi and mobile signal information.'],['StartMeUp','Charging and battery monitoring.'],['Subs','YouTube subtitle file helper.']]},fi:{apps:'Sovellukset',about:'Tietoa',intro:'Pieniä, hyödyllisiä Android-sovelluksia uteliaisuudesta.',soon:'Lataa julkaistut sovellukset alta. Lisää julkaisuja on tulossa.',download:'Lataa APK',history:'Kaikki versiot',version:'Versio 1.0.0',description:'Itsenäisiä Android-projekteja. Jokainen versio julkaistaan erikseen, ja lataaminen tapahtuu käyttäjän valinnasta. Vanhat versiot säilyvät GitHub Releases -julkaisuissa.',pending:'Julkaisu tulossa',items:[['Sports Radar 13','Urheilukoosteita useista sarjoista.'],['CashMoney','Markkina- ja salkkuseuranta teksti-TV-hengessä.'],['It’sShowTime!','Mukautettava Android-kellovidget.'],['GotJuice?','Wi-Fi- ja mobiilisignaalin tiedot.'],['StartMeUp','Latauksen ja akun seuranta.'],['Subs','YouTube-tekstitystiedostojen apuri.']]},de:{apps:'Apps',about:'Über uns',intro:'Kleine, nützliche Android-Apps aus Neugier entwickelt.',soon:'Veröffentlichte Apps unten herunterladen. Weitere Versionen folgen.',download:'APK herunterladen',history:'Alle Versionen',version:'Version',description:'Unabhängige Android-Projekte. Jede Version wird separat veröffentlicht und Downloads werden vom Nutzer bestätigt. Ältere Versionen bleiben in GitHub Releases verfügbar.',pending:'Veröffentlichung folgt',items:[['Sports Radar 13','Sport-Highlights aus mehreren Ligen.'],['CashMoney','Markt- und Depotübersicht im Teletext-Stil.'],['It’sShowTime!','Anpassbares Android-Uhr-Widget.'],['GotJuice?','WLAN- und Mobilfunksignale im Überblick.'],['StartMeUp','Lade- und Akkuüberwachung.'],['Subs','Hilfsmittel für YouTube-Untertiteldateien.']]}};const language=(navigator.language||'en').split('-')[0];const t=translations[language]||translations.en;document.documentElement.lang=translations[language]?language:'en';document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t[el.dataset.i18n]);document.getElementById('appgrid').replaceChildren(...t.items.map(([name,desc])=>{const el=document.createElement('article');el.className='app';const h=document.createElement('h3');h.textContent=name;const p=document.createElement('p');p.textContent=desc;const s=document.createElement('span');s.className='status';s.textContent=t.pending;if(name==='Subs'){const v=document.createElement('span');v.className='release';v.textContent=t.version+' …';v.dataset.releaseVersion='Subs';const a=document.createElement('a');a.className='download';a.href='https://github.com/development-maukka/Subs/releases/latest';a.textContent=t.download;a.rel='noopener noreferrer';const history=document.createElement('a');history.className='history';history.href='https://github.com/development-maukka/Subs/releases';history.rel='noopener noreferrer';history.textContent=t.history;el.append(h,p,v,a,history)}else{el.append(h,p,s)}return el}));document.getElementById('year').textContent=new Date().getFullYear();

// Latest stable GitHub release is resolved on every page load. No hard-coded version.
async function refreshReleases(){
  const versionEl=document.querySelector('[data-release-version="Subs"]');
  const downloadEl=document.querySelector('#appgrid .app .download');
  if(!versionEl||!downloadEl)return;
  const releasesUrl='https://github.com/development-maukka/Subs/releases/latest';
  downloadEl.href=releasesUrl;
  try{
    const response=await fetch('https://api.github.com/repos/development-maukka/Subs/releases/latest',{
      headers:{Accept:'application/vnd.github+json'},cache:'no-store'
    });
    if(!response.ok)throw new Error('GitHub API '+response.status);
    const release=await response.json();
    if(!release||release.draft||release.prerelease||typeof release.tag_name!=='string')throw new Error('Invalid release');
    const version=release.tag_name.replace(/^v/i,'');
    if(!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(version))throw new Error('Invalid version');
    versionEl.textContent=t.version+' '+version;
    const asset=Array.isArray(release.assets)?release.assets.find(a=>typeof a.name==='string'&&/\.apk$/i.test(a.name)&&typeof a.browser_download_url==='string'&&a.browser_download_url.startsWith('https://github.com/development-maukka/Subs/releases/download/')):null;
    if(asset)downloadEl.href=asset.browser_download_url;
  }catch(error){
    // GitHub can be temporarily unavailable or rate-limited. Keep release page accessible.
    versionEl.textContent=t.version+' —';
    downloadEl.href=releasesUrl;
    console.warn('Subs release metadata unavailable:',error.message);
  }
}
refreshReleases();
