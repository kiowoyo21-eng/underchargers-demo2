(() => {
  const params=new URLSearchParams(location.search);
  const branch=params.get('branch');
  const source=params.get('source')||'direct';
  const labels={qc:'Quezon City',md:'Mandaluyong',lp:'Las Piñas'};
  document.querySelectorAll('.appointment-branch-card').forEach(card=>{
    const cardBranch=new URL(card.href,location.origin).searchParams.get('branch');
    const selected=cardBranch===branch;
    card.classList.toggle('selected',selected);
    if(selected) card.setAttribute('aria-current','true');
  });
  const status=document.querySelector('.appointment-status');
  if(branch&&labels[branch]&&status){
    status.querySelector('span').textContent='Branch selected';
    status.querySelector('strong').textContent=`${labels[branch]} · Date & time availability`;
  }
  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push({event:'uc_booking_landing_view',branch:labels[branch]||'',source});
})();