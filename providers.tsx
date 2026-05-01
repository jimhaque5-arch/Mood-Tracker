@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

body {
  background: #0f0f1a;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  margin: 0;
  padding: 0;
  overscroll-behavior: none;
}

input::placeholder {
  color: #4c1d95;
}
