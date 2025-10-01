const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/course.controller");

// 如果你们有鉴权中间件，可以在这里加上：
// const { requireAuth, requireRole } = require("../middlewares/auth.middleware");

// ✅ 课程浏览
router.get("/", ctrl.listCourses);        // 列出所有课程（支持筛选/搜索）
router.get("/:id", ctrl.getCourse);       // 查看课程详情

// ✅ 课程管理（后台用）
router.post(
  "/",
  // requireAuth, requireRole(["admin", "staff"]),
  ctrl.createCourse
);

router.put(
  "/:id",
  // requireAuth, requireRole(["admin", "staff"]),
  ctrl.updateCourse   // 新增的更新接口
);

router.delete(
  "/:id",
  // requireAuth, requireRole(["admin", "staff"]),
  ctrl.deleteCourse
);

module.exports = router;

