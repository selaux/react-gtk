pkgs:
let
  introspectionLibs = with pkgs.gnome3; [
    gjs
    gtk
    gsettings_desktop_schemas
    pkgs.pango.out
    gdk_pixbuf
    atk
    pkgs.at_spi2_core
  ];
  typelibPaths = map (p: "${p}/lib/girepository-1.0") introspectionLibs;
in
pkgs.lib.concatStringsSep ":" typelibPaths