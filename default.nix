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
let
    pythonDogtail = python3Packages.buildPythonPackage rec {
        pname = "dogtail";
        name = "${pname}-${version}";
        version = "0.9.9";
        src = pythonPackages.fetchPypi {
          inherit pname version;
          sha256 = "0p5wfssvzr9w0bvhllzbbd8fnp4cca2qxcpcsc33dchrmh5n552x";
        };
        buildInputs = [ gnome3.gtk python3Packages.pygobject3 python3Packages.pyatspi at_spi2_core ];
        propagatedBuildInputs = [ gnome3.gtk python3Packages.pygobject3 python3Packages.pyatspi at_spi2_core ];
        preBuild = ''
            export USER="no one"
            export CERTIFIED_GNOMIE="yes"
            export LD_LIBRARY_PATH=""
            export XDG_CONFIG_DIRS=""
            export PKG_CONFIG_PATH=""
        '';
        doCheck = false;
    };
in
stdenv.mkDerivation {
  name = "react-gtk";
  version = "0.1.0";
  src = ./.;
  buildInputs = [ nodejs-8_x gnome3.gjs gnome3.gtk
                  python3 pythonDogtail xorg.xorgserver ];
  shellHook = ''
    export GTK_MODULES="gail:atk-bridge"
    export AT_SPI_BUS_LAUNCHER="${at_spi2_core}/libexec/at-spi-bus-launcher"
    export XEPHYR="${xorg.xorgserver}/bin/Xephyr"
  '';
}
