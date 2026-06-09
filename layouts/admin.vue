<template>
  <div class="admin-layout">
    <AdminResortLoader :show="isPageLoading" />

    <AdminSidebar />

    <main
      class="main-wrapper"
      :class="{ 'sidebar-collapsed': collapsed }"
    >
      <header class="topbar d-flex align-items-center justify-content-between">
        <div>
          <h3 class="fw-bold mb-1">
            {{ pageTitle }}
          </h3>

          <p class="text-muted mb-0">
            {{ pageSubtitle }}
          </p>
        </div>

        <div class="d-flex align-items-center gap-3">
          <button class="top-action-btn" type="button">
            <Icon name="solar:bell-bold-duotone" size="20" />
          </button>

          <div class="profile-dropdown">
            <button
              class="profile-card d-flex align-items-center gap-3"
              type="button"
              @click="toggleProfileMenu"
            >
              <img
                src="https://i.pravatar.cc/100"
                alt="Administrator"
              />

              <div class="profile-text">
                <h6 class="mb-0 fw-bold">
                  Administrator
                </h6>

                <small>
                  Super Admin
                </small>
              </div>

              <Icon
                class="profile-arrow"
                name="solar:alt-arrow-down-bold"
                size="16"
              />
            </button>

            <div
              v-if="showProfileMenu"
              class="profile-menu"
            >
              <button
                class="profile-menu-item logout"
                type="button"
                @click="logout"
              >
                <Icon
                  name="solar:logout-2-bold-duotone"
                  size="18"
                />

                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAdminSidebar } from '@/composables/useAdminSidebar'

const route = useRoute()
const router = useRouter()
const nuxtApp = useNuxtApp()

const { collapsed } = useAdminSidebar()
const { isPageLoading, startPageLoading, stopPageLoading } = usePageLoader()

const showProfileMenu = ref(false)

const pageTitle = computed(() => route.meta.title || 'Dashboard')
const pageSubtitle = computed(() => route.meta.subtitle || 'Welcome back to JANNS SPRING RESORT')

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const logout = async () => {
  const token = useCookie('token')

  showProfileMenu.value = false
  token.value = null

  await router.push('/')
}

nuxtApp.hook('page:start', () => {
  startPageLoading()
})

nuxtApp.hook('page:finish', () => {
  stopPageLoading(800)
})
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #f4f8f7;
}

/* DESKTOP / TABLET */
.main-wrapper {
  min-height: 100vh;
  margin-left: 290px;
  padding: 24px;

  transition:
    margin-left 0.3s ease,
    padding 0.3s ease;
}

.main-wrapper.sidebar-collapsed {
  margin-left: 170px;
}

.topbar {
  margin-bottom: 28px;
  padding-left: 24px;
}

.top-action-btn {
  width: 48px;
  height: 48px;

  border: none;
  border-radius: 16px;

  background: white;
  color: #148b80;

  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-dropdown {
  position: relative;
}

.profile-card {
  background: white;

  padding: 10px 14px;

  border: none;
  border-radius: 20px;

  cursor: pointer;
}

.profile-card img {
  width: 48px;
  height: 48px;

  border-radius: 14px;

  object-fit: cover;
}

.profile-card small {
  color: #6c757d;
}

.profile-arrow {
  color: #6c757d;
  transition: transform 0.25s ease;
}

.profile-menu {
  position: absolute;
  top: 64px;
  right: 0;

  width: 180px;

  background: white;

  border-radius: 16px;

  padding: 8px;

  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);

  z-index: 100;
}

.profile-menu-item {
  width: 100%;

  border: none;
  border-radius: 12px;

  background: transparent;

  padding: 12px 14px;

  display: flex;
  align-items: center;
  gap: 10px;

  font-weight: 600;

  transition: background 0.2s ease;
}

.profile-menu-item.logout {
  color: #dc3545;
}

.profile-menu-item:hover {
  background: #f8f9fa;
}

/* PHONE ONLY */
@media (max-width: 767px) {
  .main-wrapper,
  .main-wrapper.sidebar-collapsed {
    margin-left: 0;
    padding: 18px;
  }

  .topbar {
    align-items: flex-start !important;
    flex-direction: column;
    gap: 16px;
    padding-left: 74px;
  }

  .profile-text,
  .profile-arrow {
    display: none;
  }

  .profile-menu {
    right: 0;
  }
}
</style>