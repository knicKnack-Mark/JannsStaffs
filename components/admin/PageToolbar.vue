<template>
  <section class="page-toolbar mb-4">
    <div>
      <h5 class="fw-bold mb-1">
        {{ title }}
      </h5>

      <p class="text-muted mb-0">
        {{ subtitle }}
      </p>
    </div>

    <div
      v-if="$slots.actions"
      class="toolbar-actions"
    >
      <slot name="actions" />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.page-toolbar {
  background: white;

  border-radius: 26px;

  padding: 22px 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;

  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

:deep(.toolbar-btn) {
  height: 48px;

  border-radius: 16px;

  padding: 0 18px;

  font-weight: 800;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  border: none;
}

:deep(.toolbar-btn-primary) {
  background: linear-gradient(180deg, #0b5b54, #148b80);
  color: white;
}

:deep(.toolbar-btn-primary:hover) {
  color: white;
  transform: translateY(-1px);
}

:deep(.toolbar-btn-light) {
  background: #f4f8f7;
  color: #334155;
}

@media (max-width: 767px) {
  .page-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .toolbar-actions {
    width: 100%;
    flex-direction: column;
  }

  :deep(.toolbar-btn) {
    width: 100%;
    justify-content: center;
  }
}
</style>