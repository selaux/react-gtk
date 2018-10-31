let
  pkgs = (import ./nix/nixpkgs.nix).import {};
  typelibPaths = (import ./nix/typelib.nix) pkgs;
in
with pkgs;
stdenv.mkDerivation {
  name = "react-gtk";
  version = "0.1.0";
  src = ./.;

  buildInputs = [ nodejs-8_x gnome3.gjs gnome3.gtk gnome3.gsettings_desktop_schemas ];

  GI_TYPELIB_PATH = typelibPaths;
}
