<template>
  <div class="admin-layout">
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
          <button
            class="top-action-btn"
            type="button"
          >
            <Icon
              name="solar:bell-bold-duotone"
              size="20"
            />
          </button>

          <div class="profile-card d-flex align-items-center gap-3">
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
          </div>
        </div>
      </header>

      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAdminSidebar } from '@/composables/useAdminSidebar'

const route = useRoute()
const { collapsed } = useAdminSidebar()

const pageTitle = computed(() => route.meta.title || 'Dashboard')
const pageSubtitle = computed(() => route.meta.subtitle || 'Welcome back to JANNS SPRING RESORT')
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

.profile-card {
  background: white;

  padding: 10px 14px;

  border-radius: 20px;
}

.profile-card img {
  width: 48px;
  height: 48px;

  border-radius: 14px;

  object-fit: cover;
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

  .profile-text {
    display: none;
  }
}
</style>