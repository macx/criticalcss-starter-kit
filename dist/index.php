<!DOCTYPE html>
<html lang="en">
<head>
  <title>Critical CSS Starter Kit</title>

  <?php
    // handle critical css
    $page         = substr(basename($_SERVER['PHP_SELF']), 0, -4);
    $cssFile      = 'assets/css/main.css';
    $criticalCss  = false;
    $criticalFile = 'assets/css/critical/' . $page . '.css';

    if(file_exists($criticalFile)) {
      if($criticalStyles = file_get_contents($criticalFile)) {
        $criticalCss = true;
        echo "\n<style>" . $criticalStyles . "</style>\n";
      }
    } else {
      // if there is no critical css, just load css the regular way
      echo '<link rel="stylesheet" href="' . $cssFile . '"></style>' . "\n";
    }
  ?>
</head>
<body>
  <div>CONTENT</div>

  <?php
    if($criticalCss === true) {
      $javascriptCssLoader = 'assets/js/loadCss.min.js';
      if(file_exists($javascriptCssLoader)) {
        $loadCss = file_get_contents($loadCssFile);
        echo "\n<script>" . $loadCss;
        echo ' loadCSS(\'' . $cssFile . '\');';
        echo "</script>\n";
        echo "<noscript>" . '<link rel="stylesheet" href="' . $cssFile . '" async></noscript>' . "\n";
      }
    }
  ?>
</body>
</html>
