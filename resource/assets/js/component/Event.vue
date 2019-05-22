<template>
  <div class="item-container">
    <div class="item-content" @click="showDetailModal = true">
      <span>{{ event.summary }}</span>
      <span>{{ eventTime }}</span>
    </div>
    <button @click="showDeleteModal = true">刪除</button>

    <event-form
      v-if="showDetailModal"
      @close="showDetailModal = false"
      @update="updateEventItem"
      :event="event"
      :index="index"
    />
    <delete-event-form
      v-if="showDeleteModal"
      @close="showDeleteModal = false"
      @update="updateEventItem"
      :event="event"
      :index="index"
    />
  </div>
</template>

<script>
import EventForm from "./EventForm.vue";
import DeleteEventForm from "./DeleteEventForm.vue";

export default {
  components: {
    EventForm,
    DeleteEventForm
  },

  props: {
    event: Object,
    index: Number
  },

  data() {
    return {
      showDetailModal: false,
      showDeleteModal: false
    };
  },

  computed: {
    eventTime() {
      const dateTime = this.event.start.dateTime;
      if(dateTime){
        return dateTime.slice(0, dateTime.indexOf("T"));
      }

      return this.event.start.date;
    }
  },

  methods: {
    updateEventItem() {
      this.$emit("update");
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

.item-content{
  display: flex;
  width: 500px;

  > span:first-child{
    width: 80%;
  }
  > span:last-child {
    width: 20%;
  }
}
</style>
