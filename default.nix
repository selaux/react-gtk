let
    host_pkgs = import <nixpkgs> {};
    nixpkgs = host_pkgs.fetchFromGitHub {
        owner = "NixOS";
        repo = "nixpkgs-channels";
        rev = "799435b7cab97a39893a104999b3bc589e1172b1";
        sha256 = "1x61hpkagydrf05y0sa1ynmi8z3sm2377f4f6yiqlj9yvkg57jv3";
    };
in
with import nixpkgs {};
stdenv.mkDerivation {
  name = "react-gtk";
  version = "0.1.0";
  src = ./.;
  buildInputs = [ nodejs-8_x gnome3.gjs gnome3.gtk ];
}
