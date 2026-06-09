<template>
  <section class="mb-4 fade-slide-up delay-1">
    <div class="settings-tabs-wrapper">
      <div class="settings-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="settings-tab"
          :class="{ active: modelValue === tab.key }"
          @click="$emit('update:modelValue', tab.key)"
        >
          <Icon :name="tab.icon" size="22" />

          <span>{{ tab.label }}</span>
        </button>
      </div>

      <button
        type="button"
        class="btn save-settings-btn"
        @click="$emit('save')"
      >
        <Icon name="solar:diskette-bold-duotone" size="20" />

        <span>Save Changes</span>
      </button>
    </div>
  </section>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    required: true
  }
})

defineEmits(['update:modelValue', 'save'])
</script>

<style scoped>
.settings-tabs-wrapper {
  background: white;
  border-radius: 26px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
}

.settings-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.settings-tab {
  min-height: 52px;
  padding: 0 18px;
  border: none;
  border-radius: 17px;
  background: transparent;
  color: #64748b;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.25s ease;
}

.settings-tab:hover {
  background: #f4f8f7;
  color: #0b5b54;
}

.settings-tab.active {
  background: linear-gradient(180deg, #0b5b54, #148b80);
  color: white;
  box-shadow: 0 12px 24px rgba(11, 91, 84, 0.22);
}

.save-settings-btn {
  height: 52px;
  padding: 0 22px;
  border: none;
  border-radius: 17px;
  background: linear-gradient(180deg, #0b5b54, #148b80);
  color: white;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  box-shadow: 0 12px 24px rgba(11, 91, 84, 0.22);
  transition: all 0.25s ease;
}

.save-settings-btn:hover {
  color: white;
  transform: translateY(-1px);
}

@media (max-width: 767px) {
  .settings-tabs-wrapper {
    align-items: stretch;
    flex-direction: column;
  }

  .settings-tabs {
    width: 100%;
  }

  .settings-tab {
    flex: 1 1 calc(50% - 10px);
    justify-content: center;
  }

  .settings-tab span {
    font-size: 0.9rem;
  }

  .save-settings-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>