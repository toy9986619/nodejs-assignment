<template>
  <div>
    <span
      @click="showDetailModal = true"
    >{{ event.summary }} {{ event.start.dateTime || event.start.date }}</span>

    <event-form v-if="showDetailModal" @close="showDetailModal = false" :event="event"/>
  </div>
</template>

<script>
import EventForm from "./EventForm.vue";

export default {
  components: {
    EventForm
  },

  props: {
    event: Object
  },

  data() {
    return {
      showDetailModal: false
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
