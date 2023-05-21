fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios bump_build_version

```sh
[bundle exec] fastlane ios bump_build_version
```



### ios certificates

```sh
[bundle exec] fastlane ios certificates
```

Fetch certificates and provisioning profiles

### ios build

```sh
[bundle exec] fastlane ios build
```

Fetch certificates. Build the iOS application.

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Fetch certificates, build and upload to App Center.

### ios codepush

```sh
[bundle exec] fastlane ios codepush
```

Codepush: Fetch certificates, build and upload to App Center.

----


## Android

### android bump_build_version

```sh
[bundle exec] fastlane android bump_build_version
```

Bump version and Build the Android application.

### android build

```sh
[bundle exec] fastlane android build
```

Build the Android application.

### android beta

```sh
[bundle exec] fastlane android beta
```

Build and upload to App Center.

### android codepush

```sh
[bundle exec] fastlane android codepush
```

Codepush: Build and upload to App Center.

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
