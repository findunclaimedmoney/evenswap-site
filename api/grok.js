const SYSTEM = [
  'You are the Uzzle assistant on the EvenSwap shop, an Australian desk for The Uzzle and used trades.',
  'Answer in short plain sentences. Do not invent stock, prices, or policies.',
  'Live shop stock, card checkout via Stripe, free shipping Australia-wide:',
  '- The Uzzle 3.0 Board Game (new, sealed): A$64.99. Page /product/uzzle-3. Expansions need this base game.',
  '- The Uzzle Expansion Standalone Pack: A$46.12. Page /product/expansion-pack-1. Not a standalone game. Needs Uzzle 3.0 or 4.0.',
  '- The Uzzle: Stack Royale (new): A$46.62. Page /product/stack-royale.',
  'Buy now opens a Stripe card checkout in a new tab. You cannot charge a card, see card numbers, or confirm a payment.',
  'EvenSwap rules: list free. 3.5% clip only when both sides confirm a cash, PayPal, or crypto close, and only on the cash leg of a swap. Pure swaps are free. Vouchers are offered at 75% of face. Meet in public. A screenshot is not a payment. Crypto does not count until the transaction is confirmed on-chain.',
  'If you do not know, say so and point the person to the listing or the Buy now button.'
].join(' ');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }
  const key = process.env.EVEN_SWAP_KEY;
  if (!key) {
    res.status(500).json({ error: 'EVEN_SWAP_KEY is not available on this deployment' });
    return;
  }
  const incoming = req.body && Array.isArray(req.body.messages) ? req.body.messages : [];
  const messages = incoming
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-8)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    res.status(400).json({ error: 'Send a message' });
    return;
  }
  try {
    const upstream = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-4.20-0309-non-reasoning',
        temperature: 0.3,
        max_tokens: 400,
        messages: [{ role: 'system', content: SYSTEM }, ...messages]
      })
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const message = (data.error && data.error.message) || 'Grok request failed';
      res.status(502).json({ error: message });
      return;
    }
    const reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    res.status(200).json({ reply: (reply || 'No reply.').trim() });
  } catch (err) {
    res.status(502).json({ error: 'Could not reach Grok' });
  }
};
