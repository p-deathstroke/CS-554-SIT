const gulp = require("gulp");
const concatenate = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const autoPrefix = require("gulp-autoprefixer");
const gulpSASS = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");

const sassFiles = [
	"./src/styles/variables.scss",
	"./src/styles/custom.scss",
	"./src/styles/bootstrap/scss/_variables.scss",
];

const vendorJsFiles = [
	"./node_modules/jquery/dist/jquery.js",
	"./node_modules/popper.js/dist/umd/popper.min.js",
	"./src/styles/bootstrap/dist/js/bootstrap.js",
];

gulp.task("sass", function (done) {
	gulp
		.src(sassFiles)
		.pipe(gulpSASS())
		.pipe(concatenate("styles.css"))
		.pipe(gulp.dest("./public/css/"))
		.pipe(autoPrefix())
		.pipe(cleanCSS())
		.pipe(rename("styles.min.css"))
		.pipe(gulp.dest("./public/css/"));
	done();
});
gulp.task("js:vendor", function (done) {
	gulp
		.src(vendorJsFiles)
		.pipe(concatenate("vendor.min.js"))
		.pipe(gulp.dest("./public/js/"));
	done();
});
gulp.task("images", function (done) {
	gulp.src("src/images/*").pipe(imagemin()).pipe(gulp.dest("./public/images"));
	done();
});
gulp.task("build", gulp.parallel(["sass", "js:vendor", "images"]));

gulp.task("watch", function (done) {
	gulp.watch(sassFiles, gulp.series("sass"));
	gulp.watch(vendorJsFiles, gulp.series("js:vendor"));
	done();
});

gulp.task("default", gulp.series("watch"));
