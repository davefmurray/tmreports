<template>
  <main class="w-100 h-100">
    <RouterView />
  </main>
</template>

<style>
:root {
  --primary-color: #f0572b; /* Change this to your desired primary color */
  --green-500: #f0572b;
  --success-color: #f0572b;
}

#app {
  width: 775px;
  height: 600px;
}

*::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}

*::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f5;
}

*::-webkit-scrollbar-thumb {
  background-color: #10b981;
}
</style>
