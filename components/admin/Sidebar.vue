<template>
  <aside
    class="sidebar d-flex flex-column"
    :class="{
      collapsed,
      mobileOpen
    }"
  >
    <!-- HEADER -->
    <div>
      <div
        class="sidebar-header d-flex align-items-center justify-content-between"
      >
        <div
          class="d-flex align-items-center gap-3"
        >
          <div class="brand-logo">
            <Icon
              name="solar:palms-bold-duotone"
              size="30"
            />
          </div>

          <div v-if="!collapsed">
            <h5 class="brand-title mb-0">
              JANNS
            </h5>

            <small class="brand-subtitle">
              Admin Panel
            </small>
          </div>
        </div>

        <button
          class="sidebar-toggle d-none d-lg-flex"
          @click="collapsed = !collapsed"
        >
          <Icon
            :name="
              collapsed
                ? 'solar:alt-arrow-right-line-duotone'
                : 'solar:alt-arrow-left-line-duotone'
            "
            size="18"
          />
        </button>
      </div>

      <!-- SEARCH -->
      <div
        class="sidebar-search mt-4"
        v-if="!collapsed"
      >
        <div class="position-relative">
          <Icon
            name="solar:magnifer-linear"
            class="search-icon"
          />

          <input
            type="text"
            class="form-control custom-search"
            placeholder="Search menu..."
            v-model="search"
          />
        </div>
      </div>

      <!-- MENU -->
      <div class="mt-4">
        <small
          v-if="!collapsed"
          class="menu-label"
        >
          MAIN MENU
        </small>

        <div class="d-flex flex-column gap-2">
          <NuxtLink
            v-for="menu in filteredMenus"
            :key="menu.name"
            :to="menu.to"
            class="menu-item text-decoration-none"
            exact-active-class="active"
          >
            <div
              class="d-flex align-items-center gap-3"
            >
              <div class="menu-icon">
                <Icon
                  :name="menu.icon"
                  size="22"
                />
              </div>

              <span
                v-if="!collapsed"
                class="menu-text"
              >
                {{ menu.name }}
              </span>
            </div>

            <span
              v-if="
                menu.badge &&
                !collapsed
              "
              class="menu-badge"
            >
              {{ menu.badge }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="sidebar-footer">
      <div
        class="admin-card d-flex align-items-center gap-3"
      >
        <img
          src="https://i.pravatar.cc/100"
          alt="Admin"
          class="admin-avatar"
        />

        <div v-if="!collapsed">
          <h6 class="mb-0 fw-bold">
            Administrator
          </h6>

          <small>
            Super Admin
          </small>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { sidebarMenus } from '@/constants/sidebar'

const collapsed = ref(false)
const mobileOpen = ref(false)
const search = ref('')

const filteredMenus = computed(() => {
  return sidebarMenus.filter(menu =>
    menu.name
      .toLowerCase()
      .includes(search.value.toLowerCase())
  )
})
</script>

<style scoped>
.sidebar {
  width: 290px;

  background:
    linear-gradient(
      180deg,
      #0b5b54,
      #148b80
    );

  padding: 20px;

  position: fixed;

  inset: 0 auto 0 0;

  z-index: 1050;

  transition: all 0.3s ease;

  overflow-y: auto;

  min-height: 100vh;
}

.sidebar.collapsed {
  width: 100px;
}

.sidebar-header {
  margin-bottom: 10px;
}

.brand-logo {
  width: 60px;
  height: 60px;

  border-radius: 20px;

  background: rgba(255,255,255,0.12);

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  backdrop-filter: blur(10px);
}

.brand-title {
  color: white;

  font-size: 1.1rem;
}

.brand-subtitle {
  color: rgba(255,255,255,0.7);
}

.sidebar-toggle {
  width: 42px;
  height: 42px;

  border: none;

  border-radius: 14px;

  background: rgba(255,255,255,0.12);

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* SEARCH */
.custom-search {
  height: 52px;

  border-radius: 16px;

  border: none;

  padding-left: 48px;

  background: rgba(255,255,255,0.12);

  color: white;
}

.custom-search::placeholder {
  color: rgba(255,255,255,0.6);
}

.custom-search:focus {
  background: rgba(255,255,255,0.16);

  box-shadow: none;

  color: white;
}

.search-icon {
  position: absolute;

  top: 50%;
  left: 16px;

  transform: translateY(-50%);

  color: rgba(255,255,255,0.7);
}

/* MENU */
.menu-label {
  color: rgba(255,255,255,0.6);

  font-size: 0.8rem;

  letter-spacing: 1px;

  margin-bottom: 14px;

  display: block;
}

.menu-item {
  height: 58px;

  border-radius: 18px;

  padding: 0 18px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  color: rgba(255,255,255,0.85);

  transition: all 0.25s ease;
}

.menu-item:hover {
  background: rgba(255,255,255,0.12);

  color: white;

  transform: translateX(4px);
}

.menu-item.active {
  background: white;

  color: #0b5b54;

  box-shadow:
    0 12px 24px rgba(0,0,0,0.15);
}

.menu-badge {
  min-width: 24px;
  height: 24px;

  border-radius: 999px;

  background: #0b5b54;

  color: white;

  font-size: 0.75rem;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* FOOTER */
.sidebar-footer {
  margin-top: auto;

  padding-top: 24px;
}

.admin-card {
  background: rgba(255,255,255,0.12);

  padding: 14px;

  border-radius: 22px;

  color: white;
}

.admin-avatar {
  width: 52px;
  height: 52px;

  border-radius: 16px;

  object-fit: cover;
}

/* MOBILE */
@media (max-width: 991px) {
  .sidebar {
    width: 100%;
    max-width: 320px;
  }
}
</style>