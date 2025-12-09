<script setup>
import { VueDraggable as Draggable } from "vue-draggable-plus";
import CollapsePlaylistItem from "./CollapsePlaylistItem.vue";
import { useCourse } from "@/composable/useCourse";
import { useSection } from "@/composable/useSection";
const { courseSections } = useCourse();
const { addCourseSection, sortedSectionList } = useSection();
// import TextInputDialog from "../common/TextInputDialog.vue"
const dialogRef = ref(null);
const showDialog = ref(false);
const sectionTitle = ref("");
const handleAddSection = async (value) => {
  await addCourseSection(value);
};

const jsondata = [
  {
    chapter_name: "code",
    index: "1",
    chapter_id: "1",
    lesson_info: [
      {
        lessonid: "1",
        lesson_index: "1",
        lesson_name: "python basic",
        isFree: true,
        lesson_description: "python introduction",
        video_url: "www.example.com",
        duration_time: "23.06",
        attachment_url: "www.example.com",
      },
      {
        lessonid: "2",
        lesson_index: "2",
        lesson_name: "java",
        isFree: false,
        lesson_description: "java introduction",
        video_url: "www.example.com",
        duration_time: "24.31",
        attachment_url: "www.example.com",
      },
    ],
  },
];

onMounted(() => {
  console.log(courseSections.value);
});
</script>
<template>
  <div class="wrapper">
    <TextInputDialog
      ref="dialogRef"
      v-model:visible="showDialog"
      v-model:inputValue="sectionTitle"
      placeholder="請輸入章節名稱"
      title="建立新章節"
      @confirm="handleAddSection"
    />
    <h2 class="section-title">課程大綱與內容</h2>
    <div class="create-chapter-btn">
      <el-button type="primary" @click="dialogRef.open()"
        ><el-icon size="large" style="margin-right: 4px"><CirclePlus /></el-icon
        >建立新章節</el-button
      >
    </div>

    <el-collapse style="border: none" v-if="courseSections?.length > 0">
      <Draggable></Draggable>
      <collapse-playlist-item
        v-for="section in courseSections"
        :sectionInfo="section"
        :key="section.sectionId ?? section.id"
      ></collapse-playlist-item>
    </el-collapse>
    <el-empty v-else description="目前還沒有章節喔..." />
  </div>
</template>
<style scoped>
.create-chapter-btn {
  display: flex;
  justify-content: end;
  margin-bottom: 12px;
}
.create-chapter-btn button {
  padding: 20px 24px;
}
.el-collapse {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
