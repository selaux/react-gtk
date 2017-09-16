let
    nixpkgs = import ../../nix/nixpkgs.nix;
    makeTest = import "${nixpkgs.src}/nixos/tests/make-test.nix";
in
with nixpkgs.import {};
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
    testCases = stdenv.mkDerivation {
        name = "react-gtk-functional-test-cases";
        srcs = [ ../../test-output/functional ./dumps ./specs ];
        buildInputs = [ gtk3 at_spi2_core python3Packages.wrapPython makeWrapper ];
        pythonPath = [ pythonDogtail python3Packages.pygobject3 python3Packages.pyatspi ];
        sourceRoot = ".";
        installPhase = ''
            mkdir -p $out/bin
            cp ./specs/* $out/bin
            chmod +x $out/bin/*

            mkdir -p $out/bundles
            cp -R ./functional/* $out/bundles

            cp -R ./dumps $out

            substituteInPlace $out/bin/* --replace "test-output/functional" "$out/bundles"
            substituteInPlace $out/bin/* --replace "test/functional/dumps" "$out/dumps"
            substituteInPlace $out/bin/* --replace "/usr/bin/gjs" "${gnome3.gjs}/bin/gjs"

            wrapPythonPrograms

            wrapProgram $out/bin/*.py \
                --set GI_TYPELIB_PATH "$GI_TYPELIB_PATH" \
                --set XDG_DATA_DIRS "${gnome3.gsettings_desktop_schemas}/share/gsettings-schemas/gsettings-desktop-schemas-3.24.0/" \
                --set GTK_MODULES "gail:atk-bridge"
        '';
    };
in
{
    inherit testCases;
    test = makeTest ({ pkgs, ...} : {
      name = "react-gtk-functional-tests";

      machine =
        { config, pkgs, ... }:

        { imports = [ "${nixpkgs.src}/nixos/tests/common/user-account.nix" ];

          services.xserver.enable = true;

          services.xserver.displayManager.auto.enable = true;
          services.xserver.displayManager.auto.user = "alice";
          services.xserver.windowManager.default = "icewm";
          services.xserver.windowManager.icewm.enable = true;
          services.xserver.desktopManager.default = "none";
          services.gnome3.at-spi2-core.enable = true;
          services.packagekit.enable = true;

          virtualisation.memorySize = 1024;
        };

      testScript =
        ''
          $machine->waitForX;
          $machine->sleep(15);
          $machine->succeed("su - alice -c 'DISPLAY=:0.0 ${at_spi2_core}/libexec/at-spi-bus-launcher &'");
          $machine->sleep(1);

          my $out = './test-output';
          $machine->succeed("su - alice -c 'DISPLAY=:0.0 OUT=$out ${testCases}/bin/events_spec.py'");

          $machine->screenshot("screen");
        '';
    });
}
