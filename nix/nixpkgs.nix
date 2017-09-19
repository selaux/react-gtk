let
    host_pkgs = import <nixpkgs> {};
    src = host_pkgs.fetchFromGitHub {
        owner = "fstoerkle";
        repo = "nixpkgs";
        rev = "24d379690190409ea0e9bcfa8141315b278fb305";
        sha256 = "12kgpnqkkx2bzv93zxnyhya7z6mnbiyr0qlwc08rdz53zhpd8hi0";
    };
in
{
    inherit src;
    import = import src;
}
