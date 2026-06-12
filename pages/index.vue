<template>
  <div
    class="login-page d-flex min-vh-100 overflow-hidden"
    :class="{ loaded: pageLoaded }"
  >
    <!-- LEFT SIDE -->
    <section class="brand-section position-relative text-white d-none d-lg-flex">
      <div class="overlay"></div>

      <div class="brand-content position-relative z-2 w-100 d-flex flex-column justify-content-between p-5">
        <div>
          <div class="d-flex align-items-center gap-3 mb-4">
            <div class="logo-wrapper">
              <img src="/JANNS_logo.jpg" alt="JANNS SPRING RESORT logo" class="logo-img" />
            </div>

            <div>
              <h2 class="brand-title mb-0">JANNS SPRING RESORT</h2>
              <p class="brand-subtitle mb-0">Admin Management System</p>
            </div>
          </div>

          <div class="hero-content mt-5">
            <span class="system-badge">
              <Icon name="solar:shield-user-bold-duotone" />
              Secure Admin Portal
            </span>

            <h1 class="hero-title mt-4">
              Control Resort Operations
              <span>Efficiently & Securely</span>
            </h1>

            <p class="hero-description mt-4">
              Centralized administration system for managing staff,
              inventory, attendance, payroll, expenses, reports,
              monitoring, and all operational activities of
              JANNS SPRING RESORT.
            </p>
          </div>
        </div>

        <div class="feature-grid">
          <div class="feature-card">
            <Icon name="solar:box-bold-duotone" size="26" />
            <div>
              <h6>Inventory Management</h6>
              <p>Manage and monitor resort inventory supplies.</p>
            </div>
          </div>

          <div class="feature-card">
            <Icon name="solar:users-group-rounded-bold-duotone" size="26" />
            <div>
              <h6>Staff Monitoring</h6>
              <p>Track attendance and employee records.</p>
            </div>
          </div>

          <div class="feature-card">
            <Icon name="solar:wallet-money-bold-duotone" size="26" />
            <div>
              <h6>Financial Control</h6>
              <p>Monitor expenses and operational reports.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- RIGHT SIDE -->
    <section class="login-section flex-grow-1 d-flex align-items-center justify-content-center position-relative">
      <div class="floating-circle circle-1"></div>
      <div class="floating-circle circle-2"></div>
      <div class="floating-circle circle-3"></div>

      <div class="login-card position-relative">
        <div class="mobile-brand d-lg-none text-center mb-4">
          <div class="mobile-logo mx-auto mb-3">
            <Icon name="solar:palms-bold-duotone" size="34" />
          </div>

          <h3>JANNS SPRING RESORT</h3>
          <p>Admin Management System</p>
        </div>

        <div class="welcome-section mb-4">
          <span class="login-tag">ADMIN LOGIN</span>

          <h2 class="mt-3">Administrator Access</h2>

          <p>
            Login to access the administrative dashboard and
            management controls of JANNS SPRING RESORT.
          </p>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="input-group-custom mb-4">
            <label>Email</label>

            <div class="input-wrapper">
              <Icon name="solar:user-bold-duotone" class="input-icon" />

              <input
                v-model.trim="form.email"
                type="email"
                placeholder="Enter admin email"
                autocomplete="email"
                required
              />
            </div>
          </div>

          <div class="input-group-custom mb-3">
            <label>Password</label>

            <div class="input-wrapper">
              <Icon name="solar:lock-password-bold-duotone" class="input-icon" />

              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                autocomplete="current-password"
                required
              />

              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                <Icon
                  :name="showPassword ? 'solar:eye-closed-bold' : 'solar:eye-bold'"
                />
              </button>
            </div>
          </div>

          <div class="d-flex align-items-center justify-content-between mb-4 options-row">
            <div class="form-check remember-check">
              <input
                v-model="remember"
                class="form-check-input"
                type="checkbox"
                id="remember"
              />

              <label class="form-check-label" for="remember">
                Remember session
              </label>
            </div>

            <a href="#" class="forgot-link">Reset Password</a>
          </div>

          <button type="submit" class="login-btn w-100" :disabled="loading">
            <span>{{ loading ? 'Logging in...' : 'Login' }}</span>

            <Icon
              v-if="!loading"
              name="solar:arrow-right-up-bold"
              size="18"
            />

            <span
              v-else
              class="spinner-border spinner-border-sm"
              role="status"
            ></span>
          </button>
        </form>

        <div class="login-footer text-center mt-4">
          <p>
            Restricted administrative system for authorized
            JANNS SPRING RESORT administrators only.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import toastification from 'vue-toastification'

definePageMeta({
  layout: false
})

const { apiFetch } = useApi()
const { useToast } = toastification

const showPassword = ref(false)
const pageLoaded = ref(false)
const loading = ref(false)
const remember = ref(false)

const tokenCookie = useCookie('token')
const userCookie = useCookie('user')

const form = reactive({
  email: '',
  password: ''
})

const getBackendMessage = (err) => {
  return (
    err?.data?.message ||
    err?.response?._data?.message ||
    err?.response?.data?.message ||
    err?.message ||
    'Something went wrong. Please try again.'
  )
}

const getValidationMessage = (err) => {
  const errors =
    err?.data?.errors ||
    err?.response?._data?.errors ||
    err?.response?.data?.errors

  if (!errors) return null

  return Object.values(errors).flat()[0]
}

const handleLogin = async () => {
  if (loading.value) return

  loading.value = true

  try {
    const res = await apiFetch('/login', {
      method: 'POST',
      body: {
        email: form.email,
        password: form.password
      }
    })

    tokenCookie.value = res.token
    userCookie.value = res.user

    toast.success(res.message || 'Login successful')

    setTimeout(async () => {
      await navigateTo('/admin')
    }, 500)
  } catch (err) {
    const validationMessage = getValidationMessage(err)
    const backendMessage = getBackendMessage(err)

    toast.error(validationMessage || backendMessage)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  setTimeout(() => {
    pageLoaded.value = true
  }, 150)
})
</script>

<style scoped>
.login-page {
  background: #f4f8f7;
  font-family: Inter, sans-serif;

  opacity: 0;
  transition: opacity 0.8s ease;
}

.login-page.loaded {
  opacity: 1;
}

/* LEFT SIDE */
.brand-section {
  width: 55%;

  background:
    linear-gradient(
      135deg,
      rgba(11, 91, 84, 0.95),
      rgba(20, 139, 128, 0.92)
    ),
    url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop');

  background-size: cover;
  background-position: center;
}

.overlay {
  position: absolute;
  inset: 0;

  background:
    radial-gradient(
      circle at top right,
      rgba(255,255,255,0.15),
      transparent 35%
    );
}

.brand-content {
  transform: translateY(40px);
  opacity: 0;

  transition:
    all 1s cubic-bezier(0.22, 1, 0.36, 1);
}

.login-page.loaded .brand-content {
  transform: translateY(0);
  opacity: 1;
}

.logo-wrapper {
  width: 64px;
  height: 64px;

  border-radius: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255,255,255,0.15);

  backdrop-filter: blur(12px);

  border: 1px solid rgba(255,255,255,0.2);

  animation: floatLogo 4s ease-in-out infinite;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.brand-subtitle {
  color: rgba(255,255,255,0.75);
  font-size: 0.95rem;
}

.logo-img {
  width: 45px;
  height: 45px;
  object-fit: contain;
  border-radius: 8px;
}

.system-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 10px 18px;

  border-radius: 999px;

  background: rgba(255,255,255,0.12);

  border: 1px solid rgba(255,255,255,0.15);

  font-size: 0.9rem;
  font-weight: 600;

  backdrop-filter: blur(10px);
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;

  line-height: 1.1;

  max-width: 650px;
}

.hero-title span {
  display: block;
  color: #d6fff7;

  animation: glowText 3s ease-in-out infinite;
}

.hero-description {
  max-width: 620px;

  font-size: 1.05rem;
  line-height: 1.8;

  color: rgba(255,255,255,0.82);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  gap: 18px;
}

.feature-card {
  display: flex;
  gap: 14px;

  padding: 20px;

  border-radius: 24px;

  background: rgba(255,255,255,0.12);

  backdrop-filter: blur(14px);

  border: 1px solid rgba(255,255,255,0.12);

  transition:
    transform 0.35s ease,
    background 0.35s ease,
    border-color 0.35s ease;
}

.feature-card:hover {
  transform: translateY(-6px);

  background: rgba(255,255,255,0.18);

  border-color: rgba(255,255,255,0.28);
}

.feature-card h6 {
  margin-bottom: 4px;
  font-weight: 700;
}

.feature-card p {
  margin: 0;

  font-size: 0.85rem;

  color: rgba(255,255,255,0.72);
}

/* RIGHT SIDE */
.login-section {
  width: 45%;
  padding: 32px;
  overflow: hidden;
}

.floating-circle {
  position: absolute;

  border-radius: 50%;

  filter: blur(10px);
}

.circle-1 {
  width: 220px;
  height: 220px;

  background: rgba(20, 139, 128, 0.12);

  top: -50px;
  right: -60px;

  animation: float1 10s ease-in-out infinite;
}

.circle-2 {
  width: 160px;
  height: 160px;

  background: rgba(11, 91, 84, 0.08);

  bottom: -40px;
  left: -30px;

  animation: float2 12s ease-in-out infinite;
}

.circle-3 {
  width: 100px;
  height: 100px;

  background: rgba(20, 139, 128, 0.08);

  top: 45%;
  right: 12%;

  animation: float3 9s ease-in-out infinite;
}

.login-card {
  width: 100%;
  max-width: 520px;

  padding: 42px;

  border-radius: 36px;

  background: rgba(255,255,255,0.78);

  backdrop-filter: blur(20px);

  border: 1px solid rgba(255,255,255,0.8);

  box-shadow:
    0 20px 60px rgba(16, 24, 40, 0.12);

  transform:
    translateY(40px)
    scale(0.96);

  opacity: 0;

  transition:
    all 0.9s cubic-bezier(0.22, 1, 0.36, 1);

  transition-delay: 0.15s;
}

.login-page.loaded .login-card {
  transform:
    translateY(0)
    scale(1);

  opacity: 1;
}

.login-card::before {
  content: '';

  position: absolute;

  inset: 0;

  border-radius: inherit;

  padding: 1px;

  background:
    linear-gradient(
      135deg,
      rgba(20, 139, 128, 0.25),
      rgba(255,255,255,0.5),
      rgba(11, 91, 84, 0.2)
    );

  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);

  -webkit-mask-composite: xor;

  mask-composite: exclude;

  pointer-events: none;
}

.mobile-logo {
  width: 72px;
  height: 72px;

  border-radius: 22px;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    linear-gradient(
      135deg,
      #0b5b54,
      #148b80
    );

  color: white;

  animation: floatLogo 4s ease-in-out infinite;
}

.mobile-brand h3 {
  font-weight: 800;
  margin-bottom: 4px;
}

.mobile-brand p {
  color: #6b7280;
}

.login-tag {
  padding: 8px 16px;

  border-radius: 999px;

  background: rgba(20, 139, 128, 0.12);

  color: #0b5b54;

  font-size: 0.85rem;
  font-weight: 700;
}

.welcome-section h2 {
  font-size: 2.2rem;
  font-weight: 800;

  color: #111827;
}

.welcome-section p {
  color: #6b7280;
  line-height: 1.7;
}

.input-group-custom label {
  display: block;

  margin-bottom: 10px;

  font-size: 0.92rem;
  font-weight: 700;

  color: #374151;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  height: 62px;

  border-radius: 18px;

  border: 1px solid #dbe3e8;

  padding: 0 52px;

  font-size: 0.96rem;

  background: rgba(255,255,255,0.85);

  transition:
    all 0.3s ease,
    transform 0.2s ease;
}

.input-wrapper input:focus {
  outline: none;

  border-color: #148b80;

  box-shadow:
    0 0 0 4px rgba(20, 139, 128, 0.12);

  transform: translateY(-2px);
}

.input-icon {
  position: absolute;

  left: 18px;
  top: 50%;

  transform: translateY(-50%);

  font-size: 1.3rem;

  color: #148b80;
}

.password-toggle {
  position: absolute;

  top: 50%;
  right: 18px;

  transform: translateY(-50%);

  border: none;
  background: transparent;

  color: #6b7280;
}

.remember-check {
  color: #6b7280;
}

.remember-check input:checked {
  background-color: #148b80;
  border-color: #148b80;
}

.forgot-link {
  text-decoration: none;

  color: #148b80;

  font-weight: 700;
}

.login-btn {
  position: relative;

  overflow: hidden;

  height: 62px;

  border: none;

  border-radius: 20px;

  background:
    linear-gradient(
      135deg,
      #0b5b54,
      #148b80
    );

  color: white;

  font-weight: 700;
  font-size: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  transition: all 0.3s ease;

  box-shadow:
    0 16px 30px rgba(20, 139, 128, 0.25);
}

.login-btn::before {
  content: '';

  position: absolute;

  top: 0;
  left: -120%;

  width: 100%;
  height: 100%;

  background:
    linear-gradient(
      120deg,
      transparent,
      rgba(255,255,255,0.25),
      transparent
    );

  transition: all 0.7s ease;
}

.login-btn:hover::before {
  left: 120%;
}

.login-btn:hover {
  transform:
    translateY(-3px)
    scale(1.01);
}

.login-footer p {
  font-size: 0.88rem;

  color: #9ca3af;

  line-height: 1.6;
}

/* ANIMATIONS */
@keyframes floatLogo {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-8px);
  }

  100% {
    transform: translateY(0px);
  }
}

@keyframes float1 {
  0% {
    transform:
      translateY(0px)
      translateX(0px);
  }

  50% {
    transform:
      translateY(20px)
      translateX(-10px);
  }

  100% {
    transform:
      translateY(0px)
      translateX(0px);
  }
}

@keyframes float2 {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-20px);
  }

  100% {
    transform: translateY(0px);
  }
}

@keyframes float3 {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.15);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes glowText {
  0% {
    opacity: 0.9;
  }

  50% {
    opacity: 1;

    text-shadow:
      0 0 12px rgba(214,255,247,0.35);
  }

  100% {
    opacity: 0.9;
  }
}

/* RESPONSIVE */
@media (max-width: 1400px) {
  .hero-title {
    font-size: 3.2rem;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .login-section {
    width: 100%;
    min-height: 100vh;

    padding: 24px;
  }

  .login-card {
    padding: 32px 24px;
    border-radius: 28px;
  }
}

@media (max-width: 576px) {
  .login-section {
    padding: 16px;
  }

  .login-card {
    padding: 24px 18px;
    border-radius: 24px;
  }

  .welcome-section h2 {
    font-size: 1.8rem;
  }

  .options-row {
    flex-direction: column;

    align-items: flex-start !important;

    gap: 12px;
  }
}
</style>