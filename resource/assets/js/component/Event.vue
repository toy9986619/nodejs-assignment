<template>
  <div>
    <span
      @click="showDetailModal = true"
    >{{ event.summary }} {{ event.start.dateTime || event.start.date }}</span>

    <event-form
      v-if="showDetailModal"
      @close="showDetailModal = false"
      @update="updateEventItem"
      :event="event"
      :index="index"
    />
  </div>
</template>

<script>
import EventForm from "./EventForm.vue";

export default {
  components: {
    EventForm
  },

  props: {
    event: Object,
    index: Number
  },

  data() {
    return {
      showDetailModal: false
    };
  },

  methods: {
    updateEventItem(index, event) {
      console.log("hihi");
      console.log(event);
      this.$emit("update", index, event);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
