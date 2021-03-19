const gulp = require("gulp"),
      sass = require("gulp-sass"),
      browserSync = require("browser-sync").create(),
      uglify = require("gulp-uglify"),
      minifyCss = require("gulp-clean-css"),
      clean = require("gulp-clean"),
      concat = require("gulp-concat"),
      imagemin = require("gulp-imagemin"), 
      autoprefixer = require("gulp-autoprefixer"),
      reload = browserSync.reload;

sass.compiler = require("node-sass");

const paths = {
    html: "./index.html",
    src: {
        scss: "./src/scss/**/*.scss",
        js: "./src/js/*.js",
        img: "./src/img/**/*",
    },
    dist: {
        css: "./dist/css/",
        js: "./dist/js/",
        img: "./dist/img/",
        self: "./dist/",
    },
};

const buildJS = () =>
    gulp
        .src(paths.src.js)
        .pipe(concat("scripts.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.js))
        .pipe(browserSync.stream());

const buildCSS = () =>
    gulp
        .src(paths.src.scss)
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer("last 2 version", "safari 5", "ie 8", "ie 9"))
        .pipe(concat("styles.min.css"))
        .pipe(minifyCss())
        .pipe(gulp.dest(paths.dist.css))
        .pipe(browserSync.stream());

const buildIMG = () =>
    gulp
        .src(paths.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dist.img))
        .pipe(browserSync.stream());

const cleanDist = () =>
    gulp.src(paths.dist.self, { allowEmpty: true })
    .pipe(clean());

const build = gulp.series(buildCSS, buildJS);

const watcher = () => {
    browserSync.init({
        server: {
            baseDir: "./",
        },
    });

    gulp.watch(paths.src.scss, buildCSS).on("change", reload);
    gulp.watch(paths.src.js, buildJS).on("change", reload);
    gulp.watch(paths.src.img, buildIMG).on("change", reload);
    gulp.watch(paths.html, build).on("change", reload);
};

gulp.task("build", gulp.series(cleanDist, gulp.parallel(buildIMG, build)));
gulp.task("dev", watcher);

gulp.task(
    "default",
    gulp.series(cleanDist, gulp.parallel(buildIMG, build), watcher)
);