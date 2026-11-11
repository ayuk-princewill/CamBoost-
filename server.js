const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let balance = 0;
let orders = [];

const layout = (title, body) => `
<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} - CamBoost</title>
<style>
body{background:#0f172a;color:white;font-family:Arial;margin:0}
.sidebar{position:fixed;left:0;top:0;width:220px;height:100vh;background:#0b1220;padding:20px}
.sidebar a{display:block;color:#cbd5e1;text-decoration:none;padding:10px;border-radius:8px}
.sidebar a:hover{background:#7c3aed;color:white}
.main{margin-left:220px;padding:20px}
.top{display:flex;justify-content:space-between;align-items:center;background:#1e293b;padding:12px 18px;border-radius:12px}
.btn{background:#3b82f6;color:white;padding:10px 16px;border:none;border-radius:8px;cursor:pointer;text-decoration:none;display:inline-block}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:16px}
.card{background:#1e293b;padding:18px;border-radius:14px;text-align:center}
.card p{color:#94a3b8;font-size:13px}
input,select{width:100%;padding:12px;margin:8px 0;border-radius:8px;border:none;background:#0f172a;color:white;box-sizing:border-box}
@media(max-width:700px){.sidebar{display:none}.main{margin-left:0}.grid{grid-template-columns:1fr}}
</style></head><body>
<div class="sidebar"><h2>⚡ CamBoost</h2>
<a href="/">Dashboard</a><a href="/buy-number">Buy Number</a><a href="/rent">Rent a Number</a>
<a href="/smm">Subscribers & Followers</a><a href="/accounts">Buy Accounts</a>
<a href="/crypto">Buy / Sell Crypto</a><a href="/transactions">Transactions</a>
<a href="/support">Support</a><a href="/logout">Logout</a></div>
<div class="main">
<div class="top"><span>🟢 System Online</span><span>Balance: <b>${balance} FCFA</b> <a class="btn" href="/topup">TOP UP</a></span></div>
${body}</div></body></html>`;

app.get('/', (req,res)=>{ res.send(layout('Dashboard', `
<h2>Announcements</h2>
<div class="card" style="text-align:left">🔥 <b>New Service</b><br>Gmail and Telegram accounts now available. Find them under Buy Accounts.</div>
<div class="card" style="text-align:left;margin-top:10px">⚡ <b>Live Purchase Activity</b><br>Someone just bought TikTok 1000 Followers in Buea.</div>
<h3>Quick Actions</h3><div class="grid">
<div class="card"><a href="/buy-number" class="btn">BUY NUMBER</a><h3>Buy Number</h3><p>Verify your accounts with ease</p></div>
<div class="card"><a href="/rent" class="btn">RENT A NUMBER</a><h3>Rent a Number</h3><p>Keep your number for days, months</p></div>
<div class="card"><a href="/rent" class="btn">MY RENTALS</a><h3>My Rentals</h3><p>Your rented numbers and time left</p></div>
<div class="card"><a href="/smm" class="btn">SMM SERVICES</a><h3>SMM Services</h3><p>Boost your social media presence</p></div>
<div class="card"><a href="/accounts" class="btn">BUY ACCOUNTS</a><h3>Buy Accounts</h3><p>Buy accounts of various platforms</p></div>
<div class="card"><a href="/crypto" class="btn">BUY / SELL CRYPTO</a><h3>Buy / Sell Crypto</h3><p>Trade crypto with us directly</p></div>
<div class="card"><a href="/topup" class="btn">TOP UP WALLET</a><h3>Top Up Wallet</h3><p>Add funds - MTN MoMo / Orange Money</p></div>
<div class="card"><a href="/support" class="btn">OPEN TICKET</a><h3>Open Ticket</h3><p>Get help from our support team</p></div>
</div>
<h3>Recent Numbers</h3><div class="card">${orders.length? orders.map(o=>`<p>${o}</p>`).join('') : 'No orders yet'}</div>
<h3>Wallet</h3><div class="card">Balance: ${balance} FCFA<br><br><a href="/topup" class="btn">TOP UP</a> <a href="/transactions" class="btn">HISTORY</a></div>
`));});

app.get('/buy-number', (req,res)=>res.send(layout('Buy Number', `<h2>Buy Number - OTP Verification</h2><form action="/order" method="POST"><select name="service"><option>WhatsApp</option><option>Telegram</option><option>Gmail</option><option>TikTok</option><option>Facebook</option></select><select name="country"><option>Cameroon</option><option>Nigeria</option><option>USA</option><option>UK</option></select><input value="500 FCFA" readonly><button class="btn">Buy Number - 500 FCFA</button></form>`)));
app.get('/rent', (req,res)=>res.send(layout('Rent Number', `<h2>Rent a Number</h2><form action="/order" method="POST"><select name="service"><option>WhatsApp - 7 Days - 2500 FCFA</option><option>Telegram - 30 Days - 5000 FCFA</option></select><button class="btn">Rent Now</button></form><h3>My Rentals</h3><div class="card">No active rentals yet</div>`)));
app.get('/smm', (req,res)=>res.send(layout('SMM', `<h2>Subscribers & Followers</h2><form action="/order" method="POST"><select name="service"><option>TikTok 1000 Followers - 2500 FCFA</option><option>TikTok 1000 Likes - 1500 FCFA</option><option>Instagram 1000 Followers - 3000 FCFA</option><option>YouTube 1000 Views - 1000 FCFA</option><option>Facebook 1000 Likes - 2000 FCFA</option></select><input name="link" placeholder="Paste your profile link" required><button class="btn">Order Now</button></form>`)));
app.get('/accounts', (req,res)=>res.send(layout('Buy Accounts', `<h2>Buy Accounts</h2><div class="grid"><div class="card"><h3>Gmail Account</h3><p>1500 FCFA</p><form action="/order" method="POST"><button class="btn">Buy</button></form></div><div class="card"><h3>Telegram Account</h3><p>2000 FCFA</p><form action="/order" method="POST"><button class="btn">Buy</button></form></div></div>`)));
app.get('/crypto', (req,res)=>res.send(layout('Crypto', `<h2>Buy / Sell Crypto</h2><p>USDT, BTC - Contact us on WhatsApp to trade</p><form action="/order" method="POST"><input name="amount" placeholder="Amount in FCFA"><button class="btn">Request Trade</button></form>`)));
app.get('/topup', (req,res)=>res.send(layout('Top Up', `<h2>Top Up Wallet</h2><form action="/topup" method="POST"><select name="method"><option>MTN MoMo</option><option>Orange Money</option></select><input name="amount" placeholder="Amount FCFA" required><button class="btn">Top Up</button></form>`)));
app.post('/topup', (req,res)=>{ balance += parseInt(req.body.amount||0); orders.push('Top Up: '+req.body.amount+' FCFA'); res.redirect('/'); });
app.post('/order', (req,res)=>{ orders.push('New Order: '+(req.body.service||'Service')+' - '+(req.body.link||'')); res.redirect('/'); });
app.get('/transactions', (req,res)=>res.send(layout('Transactions', `<h2>Transactions</h2><div class="card">${orders.map(o=>`<p>${o}</p>`).join('')||'No transactions'}</div>`)));
app.get('/support', (req,res)=>res.send(layout('Support', `<h2>Support - Open Ticket</h2><form action="/order" method="POST"><input name="service" placeholder="Your problem"><button class="btn">Open Ticket</button></form><p>WhatsApp: +237 6XX XXX XXX</p>`)));
app.get('/logout', (req,res)=>res.redirect('/'));
app.listen(PORT, ()=>console.log('CamBoost running on '+PORT));
