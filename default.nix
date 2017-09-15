let
    host_pkgs = import <nixpkgs> {};
    nixpkgs = host_pkgs.fetchFromGitHub {
        owner = "selaux";
        repo = "nixpkgs";
        rev = "248b3442c9f6f4e8660bc1357f73ac7fa7a75701";
        sha256 = "1qvp9nr712g9301qlragfi1zq6mw1vg8dhxd76810302cym5nwd1";
    };
in
with import nixpkgs {};
stdenv.mkDerivation {
  name = "react-gtk";
  version = "0.1.0";
  src = ./.;
  buildInputs = [ nodejs-8_x gnome3.gjs gnome3.gtk python pythonPackages.dogtail ];
}
