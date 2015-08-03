<!DOCTYPE html>
<html lang="en">
<head>
  <title>Critical CSS Starter Kit</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

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

<header class="m-header">
  Critical CSS Starter Kit
</header>

<div class="m-content">
  <h1>
    Performance Optimization with Critical CSS
  </h1>

  <p>
    Please scroll down to view the footer.
  </p>

  <p>
    Running the task <code>grunt dist</code> must not
    include the styling of the footer in the critical css.
  </p>
</div>

<footer class="m-footer">
  Footer
</div>

<?php
  if($criticalCss === true) {
    $javascriptCssLoader = 'assets/js/loadCss.min.js';
    if(file_exists($javascriptCssLoader)) {
      $loadCss = file_get_contents($javascriptCssLoader);
      echo "\n<script>" . $loadCss;
      echo ' loadCSS(\'' . $cssFile . '\');';
      echo "</script>\n";
      echo "<noscript>" . '<link rel="stylesheet" href="' . $cssFile . '" async></noscript>' . "\n";
    }
  }
?>

</body>
</html>
