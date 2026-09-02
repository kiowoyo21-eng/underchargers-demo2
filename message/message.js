(() => {
  const PAGE='underchargersofficial';
  const params=new URLSearchParams(location.search);
  const allowed=['source','cta','utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid'];
  const attribution={}; allowed.forEach(k=>{const v=params.get(k);if(v)attribution[k]=v.slice(0,180);});
  const emit=(event,extra={})=>{const detail={event,...attribution,...extra,timestamp:new Date().toISOString()};window.dataLayer=window.dataLayer||[];window.dataLayer.push(detail);window.dispatchEvent(new CustomEvent('uc:tracking',{detail}));try{sessionStorage.setItem('uc_last_messenger_event',JSON.stringify(detail));}catch(_){}};
  emit('uc_messenger_landing_view');
  const isIOS=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const isAndroid=()=>/Android/i.test(navigator.userAgent);
  const web=`https://m.me/${PAGE}`;
  const button=document.getElementById('continue-messenger'); const fallback=document.getElementById('messenger-fallback'); const webLink=document.getElementById('messenger-web-link');
  if(webLink) webLink.href=web;
  const open=()=>{emit('uc_messenger_clickthrough',{destination:'messenger'}); const started=Date.now(); let appUrl=''; if(isIOS()) appUrl='fb-messenger-public://user-thread/514453112391852?intent_trigger=mme&source_id=1441792&nav=discover'; else if(isAndroid()) appUrl=`fb-messenger://user-thread/${PAGE}`; if(!appUrl){location.href=web;return;} location.href=appUrl; setTimeout(()=>{if(!document.hidden&&Date.now()-started<2600){if(fallback)fallback.hidden=false;location.href=web;}},1100);};
  button?.addEventListener('click',open);
  webLink?.addEventListener('click',()=>emit('uc_messenger_web_fallback_click',{destination:'m.me'}));
})();