<template>
<transition name="modal">
  <div class="modal-mask" id="baseModal">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
        </div>
        <div class="modal-body">
          <slot name="body">
            {{ message }}
            <div class="btn-wrapper">
              <button type="button" class="btn btn-default btn-sm btn-ok" @click="$emit('close')">OK</button>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
export default {
  props: ['title', 'message']
}
</script>

<style lang="scss" scoped>
@import "../../assets/sass/Modal/baseModal.scss";
</style>
