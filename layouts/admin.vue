<template>
  <div class="admin-layout">
    <AdminSidebar />

    <main class="main-wrapper">
      <header
        class="topbar d-flex align-items-center justify-content-between"
      >
        <div>
          <h3 class="fw-bold mb-1">
            Dashboard
          </h3>

          <p class="text-muted mb-0">
            Welcome back to JANNS SPRING RESORT
          </p>
        </div>

        <div class="d-flex align-items-center gap-3">
          <button class="top-action-btn">
            <Icon
              name="solar:bell-bold-duotone"
              size="20"
            />
          </button>

          <div class="profile-card d-flex align-items-center gap-3">
            <img
              src="https://i.pravatar.cc/100"
              alt=""
            />

            <div>
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

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #f4f8f7;
}

.main-wrapper {
  margin-left: 290px;
  padding: 24px;
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
}

@media (max-width: 991px) {
  .main-wrapper {
    margin-left: 0;
  }
}
</style>