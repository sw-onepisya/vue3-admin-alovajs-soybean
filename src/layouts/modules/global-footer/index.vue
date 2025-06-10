<script setup lang="ts">
defineOptions({
  name: 'GlobalFooter'
});
</script>

<template>
  <DarkModeContainer class="h-full flex-center">
    <!-- INFO: 12 Copyright 更改 -->
    <!--
 <a href="https://github.com/soybeanjs/soybean-admin/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
      Copyright MIT © 2021 Soybean
    </a> 
-->
    <span>{{ $t('system.copyRight') }}</span>
  </DarkModeContainer>
</template>

<style scoped></style>
