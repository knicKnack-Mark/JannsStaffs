<template>
  <aside
    class="sidebar d-flex flex-column"
    :class="{ collapsed }"
  >
    <!-- TOGGLE BUTTON -->
    <button
      class="sidebar-toggle d-none d-md-flex"
      :style="toggleStyle"
      @click="toggleSidebar"
      title="Toggle sidebar"
      type="button"
    >
      <Icon
        :name="collapsed ? 'mdi:chevron-right' : 'mdi:chevron-left'"
        size="22"
      />
    </button>

    <!-- HEADER -->
    <div>
      <div class="sidebar-header">
        <div
          class="brand-wrapper"
          :class="{ 'justify-content-center': collapsed }"
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
      </div>

      <!-- SEARCH -->
      <div
        v-if="!collapsed"
        class="sidebar-search mt-4"
      >
        <div class="position-relative">
          <Icon
            name="solar:magnifer-linear"
            class="search-icon"
          />

          <input
            v-model="search"
            type="text"
            class="form-control custom-search"
            placeholder="Search menu..."
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
            :title="collapsed ? menu.name : ''"
          >
            <div
              class="menu-content"
              :class="{ 'justify-content-center': collapsed }"
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
              v-if="menu.badge && !collapsed"
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
        class="admin-card"
        :class="{ 'justify-content-center': collapsed }"
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
import { useAdminSidebar } from '@/composables/useAdminSidebar'

const { collapsed, toggleSidebar } = useAdminSidebar()

const search = ref('')

/*
  This makes your sidebar safe.

  Your error happens because one item inside sidebarMenus
  probably has no name, like this:

  {
    title: 'Dashboard',
    icon: '...',
    to: '/admin'
  }

  instead of:

  {
    name: 'Dashboard',
    icon: '...',
    to: '/admin'
  }
*/
const safeMenus = computed(() => {
  return Array.isArray(sidebarMenus)
    ? sidebarMenus
        .filter(Boolean)
        .map((menu, index) => ({
          name: String(menu?.name || menu?.title || `Menu ${index + 1}`),
          to: menu?.to || '#',
          icon: menu?.icon || 'solar:widget-2-bold-duotone',
          badge: menu?.badge || null
        }))
    : []
})

const filteredMenus = computed(() => {
  const keyword = String(search.value || '').toLowerCase().trim()

  if (!keyword) {
    return safeMenus.value
  }

  return safeMenus.value.filter((menu) => {
    return String(menu.name || '')
      .toLowerCase()
      .includes(keyword)
  })
})

const toggleStyle = computed(() => {
  if (collapsed.value) {
    return {
      top: '20px',
      left: '108px',
      width: '46px',
      height: '62px',
      border: '3px solid white',
      borderLeft: '0',
      borderRadius: '0 18px 18px 0',
      background: 'linear-gradient(180deg, #0b5b54, #148b80)',
      boxShadow: '10px 10px 28px rgba(0, 0, 0, 0.18)'
    }
  }

  return {
    top: '38px',
    left: '228px',
    width: '42px',
    height: '42px',
    border: 'none',
    borderRadius: '14px',
    background: 'rgba(255, 255, 255, 0.14)',
    boxShadow: 'none'
  }
})
</script>

<style scoped>
.sidebar {
  width: 290px;
  min-height: 100vh;
  padding: 20px;

  position: fixed;
  inset: 0 auto 0 0;

  z-index: 1050;

  overflow-y: auto;
  overflow-x: visible;

  background: linear-gradient(180deg, #0b5b54, #148b80);

  transition:
    width 0.3s ease,
    padding 0.3s ease;
}

.sidebar.collapsed {
  width: 108px;
  padding: 20px 16px;
}

/* TOGGLE BUTTON */
.sidebar-toggle {
  position: fixed;

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 99999;

  transition:
    top 0.3s ease,
    left 0.3s ease,
    width 0.3s ease,
    height 0.3s ease,
    background 0.3s ease,
    transform 0.25s ease;

  cursor: pointer;
}

.sidebar-toggle:hover {
  transform: translateX(3px);
}

/* HEADER */
.sidebar-header {
  margin-bottom: 10px;
  padding-right: 52px;
}

.sidebar.collapsed .sidebar-header {
  padding-right: 0;
}

.brand-wrapper {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-logo {
  width: 60px;
  height: 60px;

  border-radius: 20px;

  background: rgba(255, 255, 255, 0.12);

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  backdrop-filter: blur(10px);

  flex-shrink: 0;
}

.brand-title {
  color: white;
  font-size: 1.1rem;
  font-weight: 800;
}

.brand-subtitle {
  color: rgba(255, 255, 255, 0.75);
}

/* SEARCH */
.custom-search {
  height: 52px;

  border-radius: 16px;

  border: none;

  padding-left: 48px;

  background: rgba(255, 255, 255, 0.12);

  color: white;
}

.custom-search::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.custom-search:focus {
  background: rgba(255, 255, 255, 0.16);
  box-shadow: none;
  color: white;
}

.search-icon {
  position: absolute;

  top: 50%;
  left: 16px;

  transform: translateY(-50%);

  color: rgba(255, 255, 255, 0.7);
}

/* MENU */
.menu-label {
  color: rgba(255, 255, 255, 0.6);

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

  color: rgba(255, 255, 255, 0.85);

  transition: all 0.25s ease;
}

.sidebar.collapsed .menu-item {
  padding: 0;
  justify-content: center;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.12);
  color: white;
}

.menu-item.active {
  background: white;
  color: #0b5b54;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.16);
}

.menu-content {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
}

.menu-icon {
  min-width: 24px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-text {
  font-weight: 500;
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
  background: rgba(255, 255, 255, 0.12);

  padding: 14px;

  border-radius: 22px;

  color: white;

  display: flex;
  align-items: center;
  gap: 14px;
}

.sidebar.collapsed .admin-card {
  padding: 10px;
}

.admin-avatar {
  width: 52px;
  height: 52px;

  border-radius: 16px;

  object-fit: cover;

  flex-shrink: 0;
}

/* PHONE ONLY */
@media (max-width: 767px) {
  .sidebar {
    width: 74px;
    padding: 16px 10px;
  }

  .sidebar.collapsed {
    width: 74px;
    padding: 16px 10px;
  }

  .sidebar-header {
    padding-right: 0;
  }

  .brand-wrapper {
    justify-content: center;
  }

  .brand-logo {
    width: 50px;
    height: 50px;
    border-radius: 18px;
  }

  .sidebar-search,
  .menu-label,
  .menu-text,
  .menu-badge,
  .admin-card div {
    display: none !important;
  }

  .menu-item {
    height: 54px;
    padding: 0;
    justify-content: center;
  }

  .menu-content {
    justify-content: center;
  }

  .admin-card {
    padding: 8px;
    justify-content: center;
  }

  .admin-avatar {
    width: 46px;
    height: 46px;
    border-radius: 15px;
  }

  .sidebar-toggle {
    display: none !important;
  }
}
</style>