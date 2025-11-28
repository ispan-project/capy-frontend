<script setup>
const visible = ref(false);
const operationDetail = ref("");
let resolveFn = null;
let currentUserdetail = null;

function open(userdetail, resolve) {
  visible.value = true;
  currentUserdetail = userdetail; //user物件
  resolveFn = resolve;
}

async function confirm() {
  // ======= 執行你的封鎖 API =======
  // const success = await blockUser(currentUserId)
  // 封鎖成功 → 關閉 dialog、switch 成功切換
  visible.value = false;

  resolveFn(true);
}

function cancel() {
  visible.value = false;
  resolveFn(false); // switch 不切換
}

defineExpose({
  open,
});
</script>
<template>
  <el-dialog v-model="visible" width="500">
    <template #header>
      <h4 class="dialog-heading">
        {{ currentUserdetail.isActive ? "禁用此用戶" : "恢復此用戶" }}
      </h4>
    </template>
    <div class="dialog-body">
      <p style="margin-bottom: 36px">
        確認{{ currentUserdetail.isActive ? "禁用用戶" : "恢復用戶" }}
        <span class="username">{{ currentUserdetail?.username }}</span
        >?
      </p>
      <el-input
        v-model="operationDetail"
        placeholder="輸入操作備註(必填) :"
        :rows="5"
        style="width: 90%"
        type="textarea"
      />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="info" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm"> 確認 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped>
.dialog-footer {
  display: flex;
  gap: 24px;
  justify-content: center;
  padding-bottom: 12px;
}
.dialog-body {
  padding: 24px;
  font-size: 18px;
  text-align: center;
}
.username {
  font-weight: 500;
  color: #409eff;
}
.dialog-heading {
  text-align: center;
  padding: 12px 0;
  font-weight: 500;
  font-size: 24px;
}
</style>
