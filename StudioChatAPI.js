<script>
    window.StudioChatAPI = (function () {
  'use strict';

  const USERS = [
    { name: 'PixelStorm99',   role: 'user',  avatar: null },
    { name: 'neonwatcher',    role: 'user',  avatar: null },
    { name: 'SakuraDancer',   role: 'user',  avatar: null },
    { name: 'turbo_frog',     role: 'user',  avatar: null },
    { name: 'xXDarkRiverXx',  role: 'user',  avatar: null },
    { name: 'MoonlitCoder',   role: 'user',  avatar: null },
    { name: 'Kwabena_GH',     role: 'user',  avatar: null },
    { name: 'FrostbyteYT',    role: 'user',  avatar: null },
    { name: 'StreamMod',      role: 'admin', avatar: null },
    { name: 'ChannelOwner',   role: 'owner', avatar: null },
  ];

  const MESSAGES = [
    'omg this is so good :face-blue-star-eyes:',
    'been waiting all week for this!',
    'LETS GOOOOOO :hand-pink-waving:',
    'first time watching, already love it',
    'pog pog pog',
    'the quality is actually insane',
    'can someone link the last stream?',
    'hello from Thailand!!',
    'W stream as always',
    ':face-blue-star-eyes: :face-blue-star-eyes: :face-blue-star-eyes:',
    'chat is eating rn',
    'did anyone else see that???',
    'I literally screamed lmaooo',
    ':rocket-red-countdown-liftoff: lets go!!',
    'this whole thing is legendary fr',
    'dropped my coffee watching this',
    'POG CHAMP',
    'new personal record!!! lets gooooo :trophy-yellow-smiling:',
    'the ending was PERFECT',
    'anyone else lagging or just me',
  ];

  const SUPERCHATS = [
    'Been watching for 2 years — best channel ever!! :trophy-yellow-smiling:',
    'You deserve every sub and more, keep it up!',
    'Legend. Pure legend. :medal-yellow-first-red:',
    'Happy birthday! Hope the stream goes amazingly :face-pink-drinking-tea:',
  ];

  const MOD_MESSAGES = [
    'Welcome everyone! Keep chat respectful :hand-pink-waving:',
    'No spoilers in chat please!',
    'Use !commands to see available bot commands.',
  ];

  const OWNER_MESSAGES = [
    'Thanks for tuning in everyone! :face-blue-star-eyes:',
    'We just hit 1000 viewers — you all are amazing!!',
    'Next stream will be Saturday at 8pm!',
  ];

  let _onMessages = null;
  let _onError = null;
  let _counter = 1;
  let _intervalId = null;

  function uid() {
    return 'msg-' + (_counter++) + '-' + Math.random().toString(36).slice(2, 7);
  }

  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function pickText(role) {
    if (role === 'owner') return randomItem(OWNER_MESSAGES);
    if (role === 'admin') return randomItem(MOD_MESSAGES);
    return randomItem(MESSAGES);
  }

  function buildMessage(overrides) {
    const user = randomItem(USERS);
    return Object.assign({
      id:           uid(),
      author:       user.name,
      author_image: user.avatar,
      role:         user.role,
      text:         pickText(user.role),
      superchat:    false,
      timestamp:    Date.now(),
    }, overrides);
  }

  function buildSuperChat() {
    return buildMessage({
      role:      'user',
      text:      randomItem(SUPERCHATS),
      superchat: true,
    });
  }

  function emit(msgs) {
    if (typeof _onMessages === 'function') {
      _onMessages(Array.isArray(msgs) ? msgs : [msgs]);
    }
  }

  // Seed with a few messages on init
  function seedMessages() {
    const seed = [];
    for (let i = 0; i < 6; i++) {
      seed.push(buildMessage());
    }
    seed.push(buildSuperChat());
    seed.push(buildMessage());
    return seed;
  }
  function startDrip() {
    function scheduleNext() {
      const delay = 1500 + Math.random() * 2500;
      _intervalId = setTimeout(function () {
        const roll = Math.random();
        if (roll < 0.08) {
          emit(buildSuperChat());
        } else {
          emit(buildMessage());
        }
        scheduleNext();
      }, delay);
    }
    scheduleNext();
  }

  return {
    initChat: function (opts) {
      _onMessages = opts.onMessages || null;
      _onError    = opts.onError    || null;

      // Deliver seed messages spread over ~600ms
      const seed = seedMessages();
      seed.forEach(function (msg, i) {
        setTimeout(function () { emit(msg); }, i * 80);
      });

      startDrip();
    },
    sendMessage: function (text, role) {
      const msg = buildMessage({ text: text, role: role || 'user' });
      emit(msg);
      return msg;
    },

    sendSuperChat: function (text) {
      const msg = buildSuperChat();
      if (text) msg.text = text;
      emit(msg);
      return msg;
    },

    burst: function (n) {
      const msgs = [];
      for (let i = 0; i < (n || 5); i++) {
        msgs.push(buildMessage());
      }
      emit(msgs);
    },

    stop: function () {
      clearTimeout(_intervalId);
    },
  };
})();
  </script>
