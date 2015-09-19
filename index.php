<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>Logbook</title>

    <link rel="stylesheet" type="text/css" href="css/styles.css">
    <script src="js/vendor/react-0.13.3.min.js"></script>
    <script src="js/vendor/moment.min.js"></script>
    <script src="js/vendor/underscore-min.js"></script>
    <script src="js/vendor/jquery.min.js"></script>

    <?php
  		$etc = 'http://www.natelaffan.com/etc/etc-inc/';
  		include ( $etc . 'partials/etc-header.php?etc=' . $etc );
  	?>

  </head>
  <body>
    <?php include $etc . 'partials/etc-menu.php'; ?>

    <div class="Logbook u-innerWidth etc-innerWidth">

      <div id="LogbookContent"></div>
    </div>
    <script type="text/javascript" src="js/logbook-viewer.js"></script>

    <?php include $etc . 'partials/etc-footer.php'; ?>

  </body>
</html>
