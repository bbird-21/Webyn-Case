<?php

// This file has been auto-generated by the Symfony Dependency Injection Component for internal use.

if (\class_exists(\ContainerMdIHNLt\App_KernelDevDebugContainer::class, false)) {
    // no-op
} elseif (!include __DIR__.'/ContainerMdIHNLt/App_KernelDevDebugContainer.php') {
    touch(__DIR__.'/ContainerMdIHNLt.legacy');

    return;
}

if (!\class_exists(App_KernelDevDebugContainer::class, false)) {
    \class_alias(\ContainerMdIHNLt\App_KernelDevDebugContainer::class, App_KernelDevDebugContainer::class, false);
}

return new \ContainerMdIHNLt\App_KernelDevDebugContainer([
    'container.build_hash' => 'MdIHNLt',
    'container.build_id' => '75c508c5',
    'container.build_time' => 1744139350,
    'container.runtime_mode' => \in_array(\PHP_SAPI, ['cli', 'phpdbg', 'embed'], true) ? 'web=0' : 'web=1',
], __DIR__.\DIRECTORY_SEPARATOR.'ContainerMdIHNLt');
