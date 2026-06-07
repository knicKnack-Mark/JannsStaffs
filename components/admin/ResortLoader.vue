<template>
  <Transition name="loader-fade">
    <div
      v-if="show"
      class="resort-loader"
    >
      <div class="loader-card">
        <div class="spring-pool">
          <div class="water-wave wave-1"></div>
          <div class="water-wave wave-2"></div>
          <div class="water-wave wave-3"></div>

          <Icon
            name="solar:waterdrops-bold-duotone"
            class="drop-icon"
            size="34"
          />
        </div>

        <p class="loader-title">
          Preparing JANNS Spring Resort
        </p>

        <p class="loader-text">
          Please wait while we refresh your data...
        </p>

        <div class="loader-bar">
          <span></span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.resort-loader {
  position: fixed;
  inset: 0;
  z-index: 999999;
  background: rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(6px);

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.loader-card {
  width: min(100%, 340px);
  background: white;
  border-radius: 30px;
  padding: 28px;
  text-align: center;
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.25);
}

.spring-pool {
  width: 92px;
  height: 92px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: #e9f8f5;
  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
}

.water-wave {
  position: absolute;
  width: 140%;
  height: 140%;
  border-radius: 42%;
  background: rgba(20, 139, 128, 0.16);
  animation: waveSpin 3s linear infinite;
}

.wave-1 {
  bottom: -78%;
}

.wave-2 {
  bottom: -74%;
  animation-duration: 4s;
  background: rgba(20, 139, 128, 0.22);
}

.wave-3 {
  bottom: -70%;
  animation-duration: 5s;
  background: rgba(11, 91, 84, 0.16);
}

.drop-icon {
  position: relative;
  z-index: 2;
  color: #148b80;
  animation: dropBounce 1.4s ease-in-out infinite;
}

.loader-title {
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 4px;
}

.loader-text {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 18px;
}

.loader-bar {
  height: 9px;
  border-radius: 999px;
  background: #eef5f3;
  overflow: hidden;
}

.loader-bar span {
  display: block;
  height: 100%;
  width: 45%;
  border-radius: inherit;
  background: linear-gradient(90deg, #0b5b54, #148b80, #7dd3c7);
  animation: loaderMove 1.2s ease-in-out infinite;
}

.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.25s ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}

@keyframes waveSpin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes dropBounce {
  0%,
  100% {
    transform: translateY(-2px);
  }

  50% {
    transform: translateY(4px);
  }
}

@keyframes loaderMove {
  0% {
    transform: translateX(-120%);
  }

  50% {
    transform: translateX(70%);
  }

  100% {
    transform: translateX(230%);
  }
}
</style>