import { useSection } from "./useSection";
const { updateCourseSection, deleteCourseSection } = useSection();
export const useLesson = (sectionInfo) => {
  const currentSectionInfo = sectionInfo;
  //pinia
  // const currentUploadingLesson = [];
  const updateSection = async (title) => {
    await updateCourseSection(currentSectionInfo.SectionId, title);
  };
  const deleteSection = async () => {
    await deleteCourseSection(currentSectionInfo.SectionId);
  };
  const defaultLessonInfo = {
    lessonTitle: "",
    description: "",
    freePreview: false,
    attachments: [],
  };

  return {
    currentSectionInfo,
    updateSection,
    deleteSection,
    defaultLessonInfo,
  };
};
