(function(){
  var TYPO={'gmial.com':'gmail.com','gmai.com':'gmail.com','gamil.com':'gmail.com','gmal.com':'gmail.com','gnail.com':'gmail.com','gmail.con':'gmail.com','gmail.co':'gmail.com','yaho.com':'yahoo.com','yahooo.com':'yahoo.com','yahoo.con':'yahoo.com','hotmial.com':'hotmail.com','hotmal.com':'hotmail.com','hotmail.con':'hotmail.com','outlok.com':'outlook.com','outlook.con':'outlook.com','iclould.com':'icloud.com','icloud.con':'icloud.com'};
  var BAD=['mailinator.com','guerrillamail.com','guerrillamail.net','sharklasers.com','10minutemail.com','10minutemail.net','tempmail.com','temp-mail.org','tempinbox.com','yopmail.com','trashmail.com','getnada.com','dispostable.com','maildrop.cc','throwawaymail.com','fakeinbox.com','mintemail.com','mohmal.com','emailondeck.com','mailnesia.com','discard.email','burnermail.io','moakt.com','spambox.us','example.com','example.org','test.com','domain.com'];
  function dns(n,t){return fetch('https://dns.google/resolve?name='+encodeURIComponent(n)+'&type='+t).then(function(r){return r.json()})}
  // returns a promise that resolves to an error message, or '' when the address looks real
  window.AIMcheckEmail=function(v){
    v=(v||'').trim().toLowerCase();
    var m=v.match(/^[^\s@]+@([a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,})$/);
    if(!m||v.indexOf('..')>-1)return Promise.resolve('Please enter a valid email address.');
    var d=m[1];
    if(TYPO[d])return Promise.resolve('Did you mean '+v.split('@')[0]+'@'+TYPO[d]+'? Please correct your email.');
    if(BAD.indexOf(d)>-1)return Promise.resolve('Please use a real, permanent email address. Temporary and test addresses are not accepted.');
    var timeout=new Promise(function(res){setTimeout(function(){res('ok')},4000)});
    var look=dns(d,'MX').then(function(j){
      if(j.Status===3)return 'bad';
      if(j.Answer&&j.Answer.length)return 'ok';
      return dns(d,'A').then(function(k){return k.Answer&&k.Answer.length?'ok':'bad'})
    }).catch(function(){return 'ok'});
    return Promise.race([look,timeout]).then(function(r){return r==='bad'?'That email domain does not appear to receive mail. Please check the address.':''});
  };
})();
(function(){
  // mobile menu
  var b=document.querySelector('.burger'),l=document.querySelector('.links');
  if(b){b.addEventListener('click',function(){var o=l.classList.toggle('open');b.setAttribute('aria-expanded',o)});
    l.addEventListener('click',function(e){if(e.target.tagName==='A')l.classList.remove('open')})}
  // subject autofill: ?subject=... or any element with data-subject
  var subj=document.getElementById('subject');
  function setSubject(t){if(subj&&t){subj.value=t}}
  if(subj){var p=new URLSearchParams(location.search).get('subject');if(p)setSubject(p)}
  document.querySelectorAll('[data-subject]').forEach(function(a){
    a.addEventListener('click',function(){setSubject(a.getAttribute('data-subject'))})});
  // contact form: verify the email, then send to Formspree
  var f=document.getElementById('contact-form'),s=document.getElementById('status');
  if(f){f.addEventListener('submit',function(e){
    e.preventDefault();
    var em=f.elements['email'];s.textContent='Checking your email...';
    window.AIMcheckEmail(em.value).then(function(err){
      if(err){s.textContent=err;em.setAttribute('aria-invalid','true');em.focus();return}
      em.removeAttribute('aria-invalid');s.textContent='Sending...';
      fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}})
        .then(function(r){if(r.ok){f.reset();s.textContent='Thanks. Your message is in and we will reply soon.'}else{s.textContent='Something went wrong. Email helloaimami@gmail.com instead.'}})
        .catch(function(){s.textContent='Network issue. Email helloaimami@gmail.com instead.'})})})}
  // chatbot placeholder toggle
  var cb=document.querySelector('.chat-btn'),cp=document.querySelector('.chat-panel');
  if(cb){cb.addEventListener('click',function(){cp.classList.toggle('open')})}
  // testimonials marquee: clone cards so the loop never shows a gap
  var tr=document.querySelector('.track');
  if(tr){var set=tr.innerHTML;tr.innerHTML=set+set+set+set;
    tr.querySelectorAll('.quote').forEach(function(q,i){if(i>=tr.children.length/4){q.setAttribute('aria-hidden','true')}})}
  // interactive AI network background
  var c=document.getElementById('net');if(!c)return;
  var x=c.getContext('2d'),W,H,pts=[],m={x:-999,y:-999},reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function size(){var r=c.getBoundingClientRect();W=c.width=r.width;H=c.height=r.height;
    pts=[];var n=Math.min(70,Math.floor(W*H/14000));
    for(var i=0;i<n;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,k:Math.random()<.15})}
  c.parentNode.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top});
  c.parentNode.addEventListener('mouseleave',function(){m.x=m.y=-999});
  function draw(){x.clearRect(0,0,W,H);
    pts.forEach(function(p){if(!reduce){p.x+=p.vx;p.y+=p.vy}
      if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1});
    for(var i=0;i<pts.length;i++){var a=pts[i];
      for(var j=i+1;j<pts.length;j++){var q=pts[j],d=Math.hypot(a.x-q.x,a.y-q.y);
        if(d<130){x.strokeStyle='rgba(0,0,0,'+(.14*(1-d/130))+')';x.beginPath();x.moveTo(a.x,a.y);x.lineTo(q.x,q.y);x.stroke()}}
      var dm=Math.hypot(a.x-m.x,a.y-m.y);
      if(dm<170){x.strokeStyle='rgba(31,75,255,'+(.8*(1-dm/170))+')';x.lineWidth=1.6;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(m.x,m.y);x.stroke();x.lineWidth=1}
      x.fillStyle=dm<170?'#1F4BFF':(a.k?'#FFD60A':'#000');x.beginPath();x.arc(a.x,a.y,a.k?5:3,0,6.3);x.fill();
      if(a.k){x.strokeStyle='#000';x.lineWidth=1;x.stroke()}}
    requestAnimationFrame(draw)}
  size();addEventListener('resize',size);draw();
})();

(function(){
  var modal=document.getElementById('nl-modal');
  function get(k,s){try{return (s?sessionStorage:localStorage).getItem(k)}catch(e){return null}}
  function set(k,s){try{(s?sessionStorage:localStorage).setItem(k,'1')}catch(e){}}
  var last=null;
  function open(){if(!modal)return;last=document.activeElement;modal.hidden=false;document.body.style.overflow='hidden';var i=modal.querySelector('input[type=email]');if(i)i.focus()}
  function close(){if(!modal)return;modal.hidden=true;document.body.style.overflow='';set('nlSeen',true);if(last&&last.focus)last.focus()}
  if(modal){
    modal.querySelector('.nl-close').addEventListener('click',close);
    modal.addEventListener('click',function(e){if(e.target===modal)close()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!modal.hidden)close()});
    modal.addEventListener('keydown',function(e){if(e.key!=='Tab')return;var f=modal.querySelectorAll('button,input:not(.hp),a[href]');var a=f[0],z=f[f.length-1];
      if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}});
    // pops up once per visit (per browser session), unless the person already subscribed
    if(modal.getAttribute('data-nl-auto')==='on'&&!get('nlSeen',true)&&!get('nlDone',false)){setTimeout(function(){if(!get('nlSeen',true))open()},2500)}
  }
  document.querySelectorAll('.nl-form').forEach(function(f){
    f.addEventListener('submit',function(e){e.preventDefault();
      var st=f.parentNode.querySelector('.nl-status'),em=f.querySelector('input[type=email]');
      st.textContent='Checking your email...';
      window.AIMcheckEmail(em.value).then(function(err){
        if(err){st.textContent=err;em.focus();return}
        st.textContent='Subscribing...';
        fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}}).then(function(r){
          if(r.ok){f.reset();st.textContent='You are in. Thanks for subscribing.';set('nlDone',false);set('nlSeen',true);if(modal&&!modal.hidden)setTimeout(close,1800)}
          else{st.textContent='Something went wrong. Email helloaimami@gmail.com instead.'}}).catch(function(){st.textContent='Network issue. Please try again.'})})})});
})();

(function(){
  // flip tiles: tap to flip on touch screens, hover or focus on desktop
  if(window.matchMedia&&matchMedia('(hover:none)').matches){
    document.querySelectorAll('.flip,.head').forEach(function(f){f.addEventListener('click',function(e){if(e.target.closest('a'))return;f.classList.toggle('on')})})}
  // creator plan switch
  document.querySelectorAll('.seg').forEach(function(seg){
    var panel=seg.closest('.panel'),cta=panel.querySelector('.btn');
    seg.querySelectorAll('button').forEach(function(btn){btn.addEventListener('click',function(){
      seg.querySelectorAll('button').forEach(function(o){o.setAttribute('aria-selected',o===btn?'true':'false')});
      panel.querySelectorAll('.pane').forEach(function(p){p.hidden=p.id!==btn.getAttribute('data-pane')});
      cta.setAttribute('data-subject',btn.getAttribute('data-sub'))})})});
})();
