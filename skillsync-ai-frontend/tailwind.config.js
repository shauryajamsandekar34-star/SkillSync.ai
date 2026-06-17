/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Token system — "rehearsal room before a performance"
        ink: '#13151A',      // deep backdrop, the dark stage
        inksoft: '#1D2027',  // raised surfaces on the dark stage
        paper: '#F7F5F0',    // the rehearsal room — light working surface
        paperdim: '#ECE8DF', // recessed paper surface
        amber: '#E8A33D',    // spotlight — primary accent, calls to action
        teal: '#2F6F6B',     // "Coach" speaker color, calm authority
        coral: '#E2614B',    // "needs work" / attention accent, used sparingly
        slate: '#6B7280',    // secondary text
      },
      fontFamily: {
        display: ['var(--font-fraunces)'],
        body: ['var(--font-inter)'],
        mono: ['var(--font-plex-mono)'],
      },
    },
  },
  plugins: [],
};
