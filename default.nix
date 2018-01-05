with (import ./nix/nixpkgs.nix).import {};
stdenv.mkDerivation {
  name = "react-gtk";
  version = "0.1.0";
  src = ./.;
  buildInputs = [ nodejs-8_x gnome3.gjs gnome3.gtk gnome3.gsettings_desktop_schemas ];
}
