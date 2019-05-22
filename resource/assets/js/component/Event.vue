<template>
  <div class="item-container">
    <span
      @click="showDetailModal = true"
    >{{ event.summary }} {{ event.start.dateTime || event.start.date }}</span>
    <button @click="deleteEvent">刪除</button>

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
    updateEventItem() {
      this.$emit("update");
    },

    deleteEvent() {
      axios
        .delete(`/api/calendar/event/${this.event.id}`)
        .then(res => {
          console.log("deleted complete");
          this.$emit("update");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.item-container {
  display: flex;
  
  > button {
    margin-right: 30px;
    margin-left: auto;
  }
}
</style>
