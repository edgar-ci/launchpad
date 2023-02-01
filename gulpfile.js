const { src, dest, watch, series } = require("gulp");
const gsass = require("gulp-sass");
const pug = require("gulp-pug");
const browserSync = require("browser-sync").create();

const sass = gsass(require("sass"));

function html() {
  return src("src/views/*.pug").pipe(pug()).pipe(dest("dist"));
}

function styles() {
  return src("src/styles/main.scss")
    .pipe(
      sass({
        includePaths: ["src/styles"],
        errLogToConsole: true,
        outputStyle: "compressed",
        onError: browserSync.notify,
      })
    )
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

function assets() {
  return src("src/assets/**/*").pipe(dest("dist/"));
}

function watchAndServe() {
  browserSync.init({
    server: "dist",
  });

  watch("src/styles/**/*.scss", styles);
  watch("src/views/*.pug", html);
  watch("src/assets/**/*", assets);
  watch("dist/*.html").on("change", browserSync.reload);
}

exports.html = html;
exports.styles = styles;
exports.watch = watchAndServe;
exports.default = series(html, styles, assets, watchAndServe);
